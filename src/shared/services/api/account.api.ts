import { api_client } from '../../config/api_client';
import { SignedX25519PublicKeyPayload } from '../crypto/x25519-public-key-signature.service';

export async function register_public_key() {
  const response = await api_client.post('/user/public_key');

  return response.data;
}

export async function register_x25519_public_key(
  payload: SignedX25519PublicKeyPayload,
) {
  const response = await api_client.post('/user/x25519_public_key', payload);

  return response.data;
}
