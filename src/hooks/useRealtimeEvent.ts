import { useEffect, useRef } from 'react';
import { useRealtime } from './useRealtime';
import { RealtimeInboundFrame } from '../types/realtime.types';

export function useRealtimeEvent(
  event_type: string,
  handler: (frame: RealtimeInboundFrame) => void | Promise<void>,
) {
  const { subscribe_to_event } = useRealtime();
  const handler_ref = useRef(handler);

  handler_ref.current = handler;

  useEffect(() => {
    return subscribe_to_event(event_type, (frame) => handler_ref.current(frame));
  }, [event_type, subscribe_to_event]);
}
