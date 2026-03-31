export type ChatSummary = {
  id: string;
  title: string;
  subtitle: string;
  last_message_preview: string;
  last_message_at: string;
  unread_count: number;
  peer_ed25519_public_key?: string | null;
  peer_x25519_public_key?: string | null;
};

export type ChatMessage = {
  chat_id: string;
  created_at: string;
  encrypted_content: string;
  id: string;
  sender_public_key: string;
};
