import * as SQLite from 'expo-sqlite';
import { env } from '../shared/config/env';
import { truncate_hex } from '../shared/utils/hex';
import { ChatMessage, ChatSummary } from '../types/chat.types';
import { UserKeyBundle, UserSearchResult } from '../types/user.types';

let database_promise: Promise<SQLite.SQLiteDatabase> | null = null;

async function get_database() {
  if (!database_promise) {
    database_promise = SQLite.openDatabaseAsync(env.sqlite_database_name);
  }

  return database_promise;
}

export async function initialize_local_chat_database() {
  const database = await get_database();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      last_message_preview TEXT NOT NULL,
      last_message_at TEXT NOT NULL,
      unread_count INTEGER NOT NULL DEFAULT 0,
      peer_ed25519_public_key TEXT,
      peer_x25519_public_key TEXT
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY NOT NULL,
      chat_id TEXT NOT NULL,
      sender_public_key TEXT NOT NULL,
      encrypted_content TEXT NOT NULL,
      created_at TEXT NOT NULL,
     FOREIGN KEY (chat_id) REFERENCES chats (id)
    );
  `);

  const chat_columns = await database.getAllAsync<{ name: string }>(
    `PRAGMA table_info(chats)`,
  );
  const has_peer_ed25519_public_key = chat_columns.some(
    (column) => column.name === 'peer_ed25519_public_key',
  );
  const has_peer_x25519_public_key = chat_columns.some(
    (column) => column.name === 'peer_x25519_public_key',
  );

  if (!has_peer_ed25519_public_key) {
    await database.execAsync(
      `ALTER TABLE chats ADD COLUMN peer_ed25519_public_key TEXT;`,
    );
  }

  if (!has_peer_x25519_public_key) {
    await database.execAsync(
      `ALTER TABLE chats ADD COLUMN peer_x25519_public_key TEXT;`,
    );
  }
}

export async function remove_dummy_chats() {
  const database = await get_database();

  await database.execAsync(`
    DELETE FROM messages
    WHERE chat_id IN ('chat_1', 'chat_2', 'chat_3')
       OR id IN ('message_1', 'message_2', 'message_3');

    DELETE FROM chats
    WHERE id IN ('chat_1', 'chat_2', 'chat_3');
  `);
}

export async function get_chat_summaries() {
  const database = await get_database();

  return database.getAllAsync<ChatSummary>(
    `SELECT id, title, subtitle, last_message_preview, last_message_at, unread_count,
            peer_ed25519_public_key, peer_x25519_public_key
     FROM chats
     ORDER BY
       CASE WHEN unread_count > 0 THEN 0 ELSE 1 END,
      id ASC`,
  );
}

export async function get_chat_summary_by_id(chat_id: string) {
  const database = await get_database();

  return database.getFirstAsync<ChatSummary>(
    `SELECT id, title, subtitle, last_message_preview, last_message_at, unread_count,
            peer_ed25519_public_key, peer_x25519_public_key
     FROM chats
     WHERE id = ?`,
    chat_id,
  );
}

export async function get_chat_messages(chat_id: string) {
  const database = await get_database();

  return database.getAllAsync<ChatMessage>(
    `SELECT id, chat_id, sender_public_key, encrypted_content, created_at
     FROM messages
     WHERE chat_id = ?
     ORDER BY created_at ASC`,
    chat_id,
  );
}

function create_user_chat_stub_id(public_key: string) {
  return `dm:${public_key}`;
}

function create_user_chat_title(user: UserSearchResult) {
  const normalized_name = user.name?.trim();

  if (normalized_name) {
    return normalized_name;
  }

  const normalized_username = user.username?.trim();

  if (normalized_username) {
    return `@${normalized_username}`;
  }

  return truncate_hex(user.public_key, 8);
}

function create_user_chat_subtitle(user: UserSearchResult) {
  const normalized_username = user.username?.trim();

  if (normalized_username) {
    return `@${normalized_username}`;
  }

  return 'Discovered on this node';
}

export async function create_or_open_user_chat_stub(
  user: UserSearchResult & UserKeyBundle,
) {
  const database = await get_database();
  const chat_id = create_user_chat_stub_id(user.public_key);
  const chat_summary: ChatSummary = {
    id: chat_id,
    last_message_at: '',
    last_message_preview: 'No messages yet',
    peer_ed25519_public_key: user.public_key,
    peer_x25519_public_key: user.x25519_public_key,
    subtitle: create_user_chat_subtitle(user),
    title: create_user_chat_title(user),
    unread_count: 0,
  };

  await database.runAsync(
    `INSERT OR IGNORE INTO chats (
       id,
       title,
       subtitle,
       last_message_preview,
       last_message_at,
       unread_count,
       peer_ed25519_public_key,
       peer_x25519_public_key
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    chat_summary.id,
    chat_summary.title,
    chat_summary.subtitle,
    chat_summary.last_message_preview,
    chat_summary.last_message_at,
    chat_summary.unread_count,
    chat_summary.peer_ed25519_public_key ?? null,
    chat_summary.peer_x25519_public_key ?? null,
  );

  await database.runAsync(
    `UPDATE chats
     SET title = ?,
         subtitle = ?,
         peer_ed25519_public_key = ?,
         peer_x25519_public_key = ?
     WHERE id = ?`,
    chat_summary.title,
    chat_summary.subtitle,
    chat_summary.peer_ed25519_public_key ?? null,
    chat_summary.peer_x25519_public_key ?? null,
    chat_summary.id,
  );

  const stored_chat = await database.getFirstAsync<ChatSummary>(
    `SELECT id, title, subtitle, last_message_preview, last_message_at, unread_count,
            peer_ed25519_public_key, peer_x25519_public_key
     FROM chats
     WHERE id = ?`,
    chat_id,
  );

  return stored_chat ?? chat_summary;
}
