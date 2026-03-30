import { SaveUserProfilePayload, UserProfile } from '../../../types/user.types';
import { api_client } from '../../config/api_client';

export async function fetch_user_profile() {
  const response = await api_client.get<UserProfile>('/user/profile');

  return response.data;
}

export async function save_user_profile(payload: SaveUserProfilePayload) {
  const response = await api_client.patch<UserProfile>('/user/profile', payload);

  return response.data;
}
