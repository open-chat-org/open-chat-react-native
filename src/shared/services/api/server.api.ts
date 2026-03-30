import { ServerPublicKeyResponse } from '../../../types/server.types';
import { api_client } from '../../config/api_client';

export async function fetch_server_public_key() {
  const response = await api_client.get<ServerPublicKeyResponse>('/server/public_key');

  return response.data;
}
