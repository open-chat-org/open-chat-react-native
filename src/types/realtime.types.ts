export type RealtimeConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

export type RealtimeChallengeResponse = {
  algorithm: 'ed25519';
  challenge_id: string;
  expires_at: string;
  nonce: string;
  server_public_key: string;
  server_signature: string;
};

export type AuthConnectPayload = {
  challenge_id: string;
  last_session_id?: string;
  public_key: string;
  signature: string;
};

export type AuthConnectFrame = {
  data: AuthConnectPayload;
  event: 'auth.connect';
};

export type DeliveryAckPayload = {
  event_id: string;
  received_at: string;
  status: 'received';
};

export type DeliveryAckFrame = {
  data: DeliveryAckPayload;
  event: 'delivery.ack';
};

export type OutboundRealtimeFrame =
  | AuthConnectFrame
  | DeliveryAckFrame
  | {
      data?: unknown;
      event: string;
    };

export type SystemConnectedFrame = {
  data: {
    public_key: string;
    restored_session: boolean;
    rooms: string[];
    session_id: string;
  };
  type: 'system.connected';
};

export type SystemErrorFrame = {
  data: {
    message: string;
  };
  type: 'system.error';
};

export type SystemRetryExhaustedFrame = {
  data: {
    event_id: string;
    session_id: string;
  };
  type: 'system.retry_exhausted';
};

export type ReliableEnvelope<Payload = unknown> = {
  ack_timeout_ms: number;
  attempt: number;
  event_id: string;
  payload: Payload;
  requires_ack: boolean;
  room_id?: string;
  sent_at: string;
  type: string;
};

export type RealtimeInboundFrame<Payload = unknown> =
  | SystemConnectedFrame
  | SystemErrorFrame
  | SystemRetryExhaustedFrame
  | ReliableEnvelope<Payload>;

export type RealtimeEventHandler = (
  frame: RealtimeInboundFrame,
) => void | Promise<void>;
