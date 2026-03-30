import * as SQLite from 'expo-sqlite';
import { env } from '../shared/config/env';
import { ChatSummary } from '../types/chat.types';

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
      unread_count INTEGER NOT NULL DEFAULT 0
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
}

export async function seed_dummy_chats() {
  const database = await get_database();
  const existing_chat = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM chats',
  );

  if ((existing_chat?.count ?? 0) > 0) {
    return;
  }

  const chats: ChatSummary[] = [
    {
      id: 'chat_1',
      title: 'Mila Hart',
      subtitle: 'Hosted on community node',
      last_message_preview: 'Encrypted hello from a dummy chat seed.',
      last_message_at: '09:24 PM',
      unread_count: 2,
    },
    {
      id: 'chat_2',
      title: 'Core Builders',
      subtitle: 'Shared room',
      last_message_preview: 'Protocol notes are ready for review.',
      last_message_at: '08:10 PM',
      unread_count: 0,
    },
    {
      id: 'chat_3',
      title: 'Self Notes',
      subtitle: 'Local encrypted vault',
      last_message_preview: 'Remember to test message sync on another node.',
      last_message_at: 'Yesterday',
      unread_count: 0,
    },
  ];

  for (const chat of chats) {
    await database.runAsync(
      `INSERT INTO chats (id, title, subtitle, last_message_preview, last_message_at, unread_count)
       VALUES (?, ?, ?, ?, ?, ?)`,
      chat.id,
      chat.title,
      chat.subtitle,
      chat.last_message_preview,
      chat.last_message_at,
      chat.unread_count,
    );
  }

  const dummy_messages = [
    {
      id: 'message_1',
      chat_id: 'chat_1',
      sender_public_key: 'public_key_mila',
      encrypted_content: 'encrypted_payload_message_1',
      created_at: '2026-03-30T09:24:00.000Z',
    },
    {
      id: 'message_2',
      chat_id: 'chat_2',
      sender_public_key: 'public_key_core_builders',
      encrypted_content: 'encrypted_payload_message_2',
      created_at: '2026-03-30T08:10:00.000Z',
    },
    {
      id: 'message_3',
      chat_id: 'chat_3',
      sender_public_key: 'public_key_self_notes',
      encrypted_content: 'encrypted_payload_message_3',
      created_at: '2026-03-29T18:30:00.000Z',
    },
  ];

  for (const message of dummy_messages) {
    await database.runAsync(
      `INSERT INTO messages (id, chat_id, sender_public_key, encrypted_content, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      message.id,
      message.chat_id,
      message.sender_public_key,
      message.encrypted_content,
      message.created_at,
    );
  }
}

export async function get_chat_summaries() {
  const database = await get_database();

  return database.getAllAsync<ChatSummary>(
    `SELECT id, title, subtitle, last_message_preview, last_message_at, unread_count
     FROM chats
     ORDER BY
       CASE WHEN unread_count > 0 THEN 0 ELSE 1 END,
       id ASC`,
  );
}
