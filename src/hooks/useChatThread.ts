import { useCallback, useEffect, useState } from 'react';
import {
  get_chat_messages,
  get_chat_summary_by_id,
} from '../services/local-chat-database.service';
import { ChatMessage, ChatSummary } from '../types/chat.types';

export function useChatThread(chat_id: string) {
  const [chat_messages, set_chat_messages] = useState<ChatMessage[]>([]);
  const [chat_summary, set_chat_summary] = useState<ChatSummary | null>(null);
  const [chat_thread_error, set_chat_thread_error] = useState('');
  const [is_loading_chat_thread, set_is_loading_chat_thread] = useState(true);

  const refresh_chat_thread = useCallback(async () => {
    try {
      set_is_loading_chat_thread(true);
      set_chat_thread_error('');

      const [next_chat_summary, next_chat_messages] = await Promise.all([
        get_chat_summary_by_id(chat_id),
        get_chat_messages(chat_id),
      ]);

      set_chat_summary(next_chat_summary ?? null);
      set_chat_messages(next_chat_messages);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load this conversation.';

      set_chat_thread_error(message);
    } finally {
      set_is_loading_chat_thread(false);
    }
  }, [chat_id]);

  useEffect(() => {
    void refresh_chat_thread();
  }, [refresh_chat_thread]);

  return {
    chat_messages,
    chat_summary,
    chat_thread_error,
    is_loading_chat_thread,
    refresh_chat_thread,
  };
}
