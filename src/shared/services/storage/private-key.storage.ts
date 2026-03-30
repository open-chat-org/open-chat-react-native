import * as SecureStore from 'expo-secure-store';
import { env } from '../../config/env';

export async function save_private_key(private_key: string) {
  await SecureStore.setItemAsync(env.secure_store_private_key_name, private_key);
}

export async function save_public_key(public_key: string) {
  await SecureStore.setItemAsync(env.secure_store_public_key_name, public_key);
}

export async function get_private_key() {
  return SecureStore.getItemAsync(env.secure_store_private_key_name);
}

export async function get_public_key() {
  return SecureStore.getItemAsync(env.secure_store_public_key_name);
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
