import { useCallback, useEffect, useState } from 'react';
import { get_chat_summaries } from '../services/local-chat-database.service';
import { ChatSummary } from '../types/chat.types';

export function useChatList() {
  const [is_loading_chats, set_is_loading_chats] = useState(true);
  const [chat_summaries, set_chat_summaries] = useState<ChatSummary[]>([]);

  const refresh_chats = useCallback(async () => {
    try {
      set_is_loading_chats(true);
      const chats = await get_chat_summaries();
      set_chat_summaries(chats);
    } finally {
      set_is_loading_chats(false);
    }
  }, []);

  useEffect(() => {
    void refresh_chats();
  }, [refresh_chats]);

  return {
    chat_summaries,
    is_loading_chats,
    refresh_chats,
  };
}
