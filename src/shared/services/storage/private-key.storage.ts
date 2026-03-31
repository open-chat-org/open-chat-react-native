import * as SecureStore from 'expo-secure-store';
import { env } from '../../config/env';
import { add_hex_prefix } from '../crypto/ed25519.service';

export async function save_private_key(private_key: string) {
  await SecureStore.setItemAsync(env.secure_store_private_key_name, private_key);
}

export async function save_public_key(public_key: string) {
  await SecureStore.setItemAsync(
    env.secure_store_public_key_name,
    add_hex_prefix(public_key),
  );
}

export async function get_private_key() {
  return SecureStore.getItemAsync(env.secure_store_private_key_name);
}

export async function save_realtime_session_id(session_id: string) {
  await SecureStore.setItemAsync(
    env.secure_store_realtime_session_name,
    session_id,
  );
}

export async function get_public_key() {
  const public_key = await SecureStore.getItemAsync(
    env.secure_store_public_key_name,
  );

  return public_key ? add_hex_prefix(public_key) : null;
}

export async function get_realtime_session_id() {
  return SecureStore.getItemAsync(env.secure_store_realtime_session_name);
}

export async function clear_realtime_session_id() {
  await SecureStore.deleteItemAsync(env.secure_store_realtime_session_name);
}

export async function get_local_identity() {
  const [private_key, public_key] = await Promise.all([
    get_private_key(),
    get_public_key(),
  ]);

  return {
    has_identity: Boolean(private_key && public_key),
    private_key,
    public_key,
  };
}
