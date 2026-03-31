import { api_client } from '../../config/api_client';
import { RealtimeChallengeResponse } from '../../../types/realtime.types';

export async function fetch_realtime_challenge(public_key: string) {
  const response = await api_client.post<RealtimeChallengeResponse>(
    '/realtime/challenge',
    undefined,
    {
      headers: {
        'x-public-key': public_key,
      },
    },
  );

  return response.data;
}
