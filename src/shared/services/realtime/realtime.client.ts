import {
  get_private_key,
  get_public_key,
  get_realtime_session_id,
  save_realtime_session_id,
} from '../storage/private-key.storage';
import {
  sign_raw_message,
  verify_raw_message_signature,
} from '../crypto/ed25519.service';
import {
  DeliveryAckFrame,
  OutboundRealtimeFrame,
  RealtimeChallengeResponse,
  RealtimeConnectionStatus,
  RealtimeInboundFrame,
  SystemConnectedFrame,
} from '../../../types/realtime.types';
import { fetch_realtime_challenge } from './realtime.api';
import {
  create_realtime_challenge_message,
  create_realtime_websocket_url,
  is_reliable_envelope,
  is_system_connected_frame,
  is_system_error_frame,
  normalize_hex_value,
} from './realtime.utils';

const reconnect_backoff_ms = [1_000, 2_000, 4_000, 8_000, 15_000];

type RealtimeClientOptions = {
  clear_error: () => void;
  clear_session: () => void;
  dispatch_event: (frame: RealtimeInboundFrame) => void;
  ensure_server_public_key: () => Promise<string>;
  set_error: (
    message: string,
    status?: RealtimeConnectionStatus,
  ) => void;
  set_last_session_id: (session_id: string | null) => void;
  set_retry_attempt: (attempt: number) => void;
  set_session: (session_id: string, connected_at?: string) => void;
  set_status: (status: RealtimeConnectionStatus) => void;
};

export class RealtimeClient {
  private readonly websocket_url = create_realtime_websocket_url();
  private socket: WebSocket | null = null;
  private reconnect_timeout: ReturnType<typeof setTimeout> | null = null;
  private is_connecting = false;
  private reconnect_attempt = 0;
  private should_reconnect = true;
  private connection_version = 0;

  constructor(private readonly options: RealtimeClientOptions) {}

  async connect() {
    if (this.is_connecting) {
      return;
    }

    if (
      this.socket?.readyState === WebSocket.CONNECTING ||
      this.socket?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    this.should_reconnect = true;
    this.clear_reconnect_timeout();
    this.is_connecting = true;
    this.connection_version += 1;

    const current_connection_version = this.connection_version;

    try {
      this.options.clear_error();
      this.options.set_status(
        this.reconnect_attempt > 0 ? 'reconnecting' : 'connecting',
      );
      this.options.set_retry_attempt(this.reconnect_attempt);

      const [public_key, private_key, last_session_id, expected_server_public_key] =
        await Promise.all([
          get_public_key(),
          get_private_key(),
          get_realtime_session_id(),
          this.options.ensure_server_public_key(),
        ]);

      if (!public_key || !private_key) {
        this.handle_non_retryable_error('Local identity is incomplete.');
        return;
      }

      const challenge = await fetch_realtime_challenge(public_key);

      await this.verify_server_challenge(
        challenge,
        expected_server_public_key,
        public_key,
      );

      const signature = await sign_raw_message(
        create_realtime_challenge_message(
          challenge.challenge_id,
          public_key,
          challenge.nonce,
          challenge.expires_at,
        ),
        private_key,
      );

      if (
        current_connection_version !== this.connection_version ||
        !this.should_reconnect
      ) {
        return;
      }

      const socket = new WebSocket(this.websocket_url);

      this.socket = socket;
      socket.onopen = () => {
        this.send_frame({
          data: {
            challenge_id: challenge.challenge_id,
            last_session_id: last_session_id ?? undefined,
            public_key,
            signature,
          },
          event: 'auth.connect',
        });
      };
      socket.onmessage = (event) => {
        void this.handle_message(event.data);
      };
      socket.onerror = () => {
        this.options.set_error(
          'Realtime connection encountered an unexpected socket error.',
          'error',
        );
      };
      socket.onclose = (event) => {
        void this.handle_close(event.code, event.reason);
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to connect to realtime.';

      this.handle_connection_error(message);
    } finally {
      this.is_connecting = false;
    }
  }

  disconnect() {
    this.should_reconnect = false;
    this.clear_reconnect_timeout();

    if (this.socket) {
      const socket = this.socket;

      this.socket = null;

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close(1000, 'Realtime disconnected by client');
      }
    }

    this.options.clear_error();
    this.options.clear_session();
    this.options.set_retry_attempt(0);
    this.options.set_status('disconnected');
    this.reconnect_attempt = 0;
  }

  send_event(event: string, data?: unknown) {
    this.send_frame({
      data,
      event,
    });
  }

  private send_frame(frame: OutboundRealtimeFrame) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Realtime socket is not connected.');
    }

    this.socket.send(JSON.stringify(frame));
  }

  private async handle_message(raw_message: string | ArrayBuffer) {
    try {
      const message =
        typeof raw_message === 'string'
          ? raw_message
          : new TextDecoder().decode(raw_message);
      const parsed_message = JSON.parse(message) as RealtimeInboundFrame;

      if (!parsed_message || typeof parsed_message !== 'object') {
        return;
      }

      if (is_system_connected_frame(parsed_message)) {
        await this.handle_system_connected(parsed_message);
        this.options.dispatch_event(parsed_message);
        return;
      }

      if (is_system_error_frame(parsed_message)) {
        this.options.set_error(parsed_message.data.message, 'error');
        this.options.dispatch_event(parsed_message);
        return;
      }

      if (is_reliable_envelope(parsed_message) && parsed_message.requires_ack) {
        this.send_delivery_ack(parsed_message.event_id);
      }

      this.options.dispatch_event(parsed_message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to process a realtime message.';

      this.options.set_error(message, 'error');
    }
  }

  private async handle_system_connected(frame: SystemConnectedFrame) {
    this.reconnect_attempt = 0;
    this.options.clear_error();
    this.options.set_retry_attempt(0);
    this.options.set_session(frame.data.session_id, new Date().toISOString());
    this.options.set_last_session_id(frame.data.session_id);
    this.options.set_status('connected');
    await save_realtime_session_id(frame.data.session_id);
  }

  private async handle_close(code?: number, reason?: string) {
    this.socket = null;
    this.is_connecting = false;
    this.options.clear_session();

    if (!this.should_reconnect) {
      this.options.set_status('disconnected');
      return;
    }

    if (code === 1000 || code === 4001 || code === 4401) {
      this.options.set_status('error');

      if (reason) {
        this.options.set_error(reason, 'error');
      }

      return;
    }

    this.schedule_reconnect(reason || 'Realtime connection closed.');
  }

  private async verify_server_challenge(
    challenge: RealtimeChallengeResponse,
    expected_server_public_key: string,
    public_key: string,
  ) {
    const normalized_expected_public_key = normalize_hex_value(
      expected_server_public_key,
    );
    const normalized_server_public_key = normalize_hex_value(
      challenge.server_public_key,
    );

    if (normalized_expected_public_key !== normalized_server_public_key) {
      throw new Error('Server public key mismatch during realtime challenge.');
    }

    const challenge_message = create_realtime_challenge_message(
      challenge.challenge_id,
      public_key,
      challenge.nonce,
      challenge.expires_at,
    );
    const is_valid_server_signature = await verify_raw_message_signature(
      challenge_message,
      challenge.server_signature,
      normalized_server_public_key,
    );

    if (!is_valid_server_signature) {
      throw new Error('Failed to verify the realtime server signature.');
    }
  }

  private send_delivery_ack(event_id: string) {
    try {
      const frame: DeliveryAckFrame = {
        data: {
          event_id,
          received_at: new Date().toISOString(),
          status: 'received',
        },
        event: 'delivery.ack',
      };

      this.send_frame(frame);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send delivery ack.';

      this.options.set_error(message, 'error');
    }
  }

  private handle_connection_error(message: string) {
    if (this.is_non_retryable_error(message)) {
      this.handle_non_retryable_error(message);
      return;
    }

    this.schedule_reconnect(message);
  }

  private handle_non_retryable_error(message: string) {
    this.clear_reconnect_timeout();
    this.options.set_retry_attempt(this.reconnect_attempt);
    this.options.set_error(message, 'error');
  }

  private schedule_reconnect(message: string) {
    if (!this.should_reconnect) {
      return;
    }

    this.clear_reconnect_timeout();
    this.reconnect_attempt += 1;
    this.options.set_retry_attempt(this.reconnect_attempt);
    this.options.set_error(message, 'reconnecting');
    this.options.set_status('reconnecting');

    const retry_delay =
      reconnect_backoff_ms[
        Math.min(this.reconnect_attempt - 1, reconnect_backoff_ms.length - 1)
      ];

    this.reconnect_timeout = setTimeout(() => {
      void this.connect();
    }, retry_delay);
  }

  private clear_reconnect_timeout() {
    if (!this.reconnect_timeout) {
      return;
    }

    clearTimeout(this.reconnect_timeout);
    this.reconnect_timeout = null;
  }

  private is_non_retryable_error(message: string) {
    return (
      message.includes('Local identity is incomplete') ||
      message.includes('Server public key mismatch') ||
      message.includes('Failed to verify the realtime server signature')
    );
  }
}
