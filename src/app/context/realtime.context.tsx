import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { useRealtimeStore } from '../../store/realtime.store';
import { useServerStore } from '../../store/server.store';
import { RealtimeInboundFrame } from '../../types/realtime.types';
import { RealtimeClient } from '../../shared/services/realtime/realtime.client';

type RealtimeContextValue = {
  connect: () => Promise<void>;
  disconnect: () => void;
  send_event: (event: string, data?: unknown) => void;
  subscribe_to_event: (
    event_type: string,
    handler: (frame: RealtimeInboundFrame) => void | Promise<void>,
  ) => () => void;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

type RealtimeProviderProps = {
  children: ReactNode;
  public_key: string;
};

export function RealtimeProvider({
  children,
  public_key,
}: RealtimeProviderProps) {
  const client_ref = useRef<RealtimeClient | null>(null);
  const context_value_ref = useRef<RealtimeContextValue | null>(null);

  if (!client_ref.current) {
    client_ref.current = new RealtimeClient({
      clear_error: () => useRealtimeStore.getState().clear_error(),
      clear_session: () => useRealtimeStore.getState().clear_session(),
      dispatch_event: (frame) => useRealtimeStore.getState().dispatch_event(frame),
      ensure_server_public_key: async () => {
        const current_public_key = useServerStore.getState().server_public_key;

        if (current_public_key) {
          return current_public_key;
        }

        await useServerStore.getState().fetch_server_public_key();

        const next_public_key = useServerStore.getState().server_public_key;

        if (next_public_key) {
          return next_public_key;
        }

        throw new Error(
          useServerStore.getState().server_public_key_error ||
            'Failed to load the server public key.',
        );
      },
      set_error: (message, status) =>
        useRealtimeStore.getState().set_error(message, status),
      set_last_session_id: (session_id) =>
        useRealtimeStore.getState().set_last_session_id(session_id),
      set_retry_attempt: (attempt) =>
        useRealtimeStore.getState().set_retry_attempt(attempt),
      set_session: (session_id, connected_at) =>
        useRealtimeStore.getState().set_session(session_id, connected_at),
      set_status: (status) => useRealtimeStore.getState().set_status(status),
    });
  }

  if (!context_value_ref.current) {
    context_value_ref.current = {
      connect: () => client_ref.current!.connect(),
      disconnect: () => client_ref.current!.disconnect(),
      send_event: (event, data) => client_ref.current!.send_event(event, data),
      subscribe_to_event: (event_type, handler) =>
        useRealtimeStore
          .getState()
          .register_event_subscriber(event_type, handler),
    };
  }

  useEffect(() => {
    if (!public_key) {
      return;
    }

    void client_ref.current?.connect();

    return () => {
      client_ref.current?.disconnect();
      useRealtimeStore.getState().reset();
    };
  }, [public_key]);

  return (
    <RealtimeContext.Provider value={context_value_ref.current}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtimeContext() {
  const context = useContext(RealtimeContext);

  if (!context) {
    throw new Error('useRealtimeContext must be used inside RealtimeProvider.');
  }

  return context;
}
