import { api_client } from '../../config/api_client';

export async function register_public_key() {
  const response = await api_client.post('/user/public_key');

  return response.data;
}
