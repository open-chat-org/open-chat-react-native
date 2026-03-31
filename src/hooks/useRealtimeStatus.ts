import { useRealtimeStore } from '../store/realtime.store';

export function useRealtimeStatus() {
  const connected_at = useRealtimeStore((state) => state.connected_at);
  const last_error = useRealtimeStore((state) => state.last_error);
  const last_session_id = useRealtimeStore((state) => state.last_session_id);
  const retry_attempt = useRealtimeStore((state) => state.retry_attempt);
  const session_id = useRealtimeStore((state) => state.session_id);
  const status = useRealtimeStore((state) => state.status);

  return {
    connected_at,
    last_error,
    last_session_id,
    retry_attempt,
    session_id,
    status,
  };
}
