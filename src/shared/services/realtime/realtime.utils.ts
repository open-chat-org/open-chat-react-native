import { env } from '../../config/env';
import {
  add_hex_prefix,
} from '../crypto/ed25519.service';
import {
  RealtimeInboundFrame,
  ReliableEnvelope,
  SystemConnectedFrame,
  SystemErrorFrame,
  SystemRetryExhaustedFrame,
} from '../../../types/realtime.types';

export function create_realtime_challenge_message(
  challenge_id: string,
  public_key: string,
  nonce: string,
  expires_at: string,
) {
  return `open-chat:ws-auth:${challenge_id}:${public_key}:${nonce}:${expires_at}`;
}

export function create_realtime_websocket_url() {
  const backend_url = new URL(env.backend_base_url);
  const websocket_url = new URL(env.backend_realtime_path, backend_url);

  websocket_url.protocol = backend_url.protocol === 'https:' ? 'wss:' : 'ws:';

  return websocket_url.toString();
}

export function normalize_hex_value(value: string) {
  return add_hex_prefix(value.trim());
}

export function is_system_connected_frame(
  frame: RealtimeInboundFrame,
): frame is SystemConnectedFrame {
  return frame.type === 'system.connected';
}

export function is_system_error_frame(
  frame: RealtimeInboundFrame,
): frame is SystemErrorFrame {
  return frame.type === 'system.error';
}

export function is_system_retry_exhausted_frame(
  frame: RealtimeInboundFrame,
): frame is SystemRetryExhaustedFrame {
  return frame.type === 'system.retry_exhausted';
}

export function is_reliable_envelope(
  frame: RealtimeInboundFrame,
): frame is ReliableEnvelope {
  return 'event_id' in frame && 'requires_ack' in frame;
}
