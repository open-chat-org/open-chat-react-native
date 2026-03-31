import * as SecureStore from 'expo-secure-store';
import { env } from '../../config/env';
import { add_hex_prefix } from '../crypto/ed25519.service';

export async function save_ed25519_private_key(private_key: string) {
  await SecureStore.setItemAsync(
    env.secure_store_ed25519_private_key_name,
    private_key,
  );
}

export async function save_ed25519_public_key(public_key: string) {
  await SecureStore.setItemAsync(
    env.secure_store_ed25519_public_key_name,
    add_hex_prefix(public_key),
  );
}

export async function save_x25519_private_key(private_key: string) {
  await SecureStore.setItemAsync(
    env.secure_store_x25519_private_key_name,
    private_key,
  );
}

export async function save_x25519_public_key(public_key: string) {
  await SecureStore.setItemAsync(
    env.secure_store_x25519_public_key_name,
    add_hex_prefix(public_key),
  );
}

export async function get_ed25519_private_key() {
  return SecureStore.getItemAsync(env.secure_store_ed25519_private_key_name);
}

export async function save_realtime_session_id(session_id: string) {
  await SecureStore.setItemAsync(
    env.secure_store_realtime_session_name,
    session_id,
  );
}

export async function get_ed25519_public_key() {
  const public_key = await SecureStore.getItemAsync(
    env.secure_store_ed25519_public_key_name,
  );

  return public_key ? add_hex_prefix(public_key) : null;
}

export async function get_x25519_private_key() {
  return SecureStore.getItemAsync(env.secure_store_x25519_private_key_name);
}

export async function get_x25519_public_key() {
  const public_key = await SecureStore.getItemAsync(
    env.secure_store_x25519_public_key_name,
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
  const [
    ed25519_private_key,
    ed25519_public_key,
    x25519_private_key,
    x25519_public_key,
  ] = await Promise.all([
    get_ed25519_private_key(),
    get_ed25519_public_key(),
    get_x25519_private_key(),
    get_x25519_public_key(),
  ]);

  return {
    ed25519_private_key,
    ed25519_public_key,
    has_identity: Boolean(ed25519_private_key && ed25519_public_key),
    x25519_private_key,
    x25519_public_key,
  };
}
