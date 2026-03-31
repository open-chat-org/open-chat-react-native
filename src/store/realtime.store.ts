import { create } from 'zustand';
import {
  RealtimeConnectionStatus,
  RealtimeEventHandler,
  RealtimeInboundFrame,
} from '../types/realtime.types';

const event_subscribers = new Map<string, Map<string, RealtimeEventHandler>>();

type RealtimeStore = {
  clear_error: () => void;
  clear_session: () => void;
  connected_at: string | null;
  dispatch_event: (frame: RealtimeInboundFrame) => void;
  last_error: string;
  last_session_id: string | null;
  register_event_subscriber: (
    event_type: string,
    handler: RealtimeEventHandler,
  ) => () => void;
  reset: () => void;
  retry_attempt: number;
  session_id: string | null;
  set_error: (
    message: string,
    status?: RealtimeConnectionStatus,
  ) => void;
  set_last_session_id: (session_id: string | null) => void;
  set_retry_attempt: (attempt: number) => void;
  set_session: (session_id: string, connected_at?: string) => void;
  set_status: (status: RealtimeConnectionStatus) => void;
  status: RealtimeConnectionStatus;
};

function dispatch_to_event_type(
  event_type: string,
  frame: RealtimeInboundFrame,
) {
  const subscribers = event_subscribers.get(event_type);

  if (!subscribers) {
    return;
  }

  for (const handler of subscribers.values()) {
    void handler(frame);
  }
}

export const useRealtimeStore = create<RealtimeStore>((set) => ({
  clear_error: () => {
    set({
      last_error: '',
    });
  },
  clear_session: () => {
    set({
      connected_at: null,
      session_id: null,
    });
  },
  connected_at: null,
  dispatch_event: (frame) => {
    dispatch_to_event_type(frame.type, frame);
    dispatch_to_event_type('*', frame);
  },
  last_error: '',
  last_session_id: null,
  register_event_subscriber: (event_type, handler) => {
    const subscriber_id = `${event_type}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2)}`;
    const subscribers = event_subscribers.get(event_type) ?? new Map();

    subscribers.set(subscriber_id, handler);
    event_subscribers.set(event_type, subscribers);

    return () => {
      const current_subscribers = event_subscribers.get(event_type);

      if (!current_subscribers) {
        return;
      }

      current_subscribers.delete(subscriber_id);

      if (current_subscribers.size === 0) {
        event_subscribers.delete(event_type);
      }
    };
  },
  reset: () => {
    event_subscribers.clear();
    set({
      connected_at: null,
      last_error: '',
      last_session_id: null,
      retry_attempt: 0,
      session_id: null,
      status: 'idle',
    });
  },
  retry_attempt: 0,
  session_id: null,
  set_error: (message, status = 'error') => {
    set({
      last_error: message,
      status,
    });
  },
  set_last_session_id: (session_id) => {
    set({
      last_session_id: session_id,
    });
  },
  set_retry_attempt: (attempt) => {
    set({
      retry_attempt: attempt,
    });
  },
  set_session: (session_id, connected_at = new Date().toISOString()) => {
    set({
      connected_at,
      session_id,
    });
  },
  set_status: (status) => {
    set({
      status,
    });
  },
  status: 'idle',
}));
