import {
  SaveUserProfilePayload,
  UserKeyBundle,
  UserSearchResult,
  UserProfile,
} from '../../../types/user.types';
import { api_client } from '../../config/api_client';
import { create_signed_profile_payload } from '../crypto/profile-signature.service';

export async function fetch_user_profile() {
  const response = await api_client.get<UserProfile>('/user/profile');

  return response.data;
}

export async function save_user_profile(payload: SaveUserProfilePayload) {
  const signed_payload = await create_signed_profile_payload(payload);
  const response = await api_client.patch<UserProfile>(
    '/user/profile',
    signed_payload,
  );

  return response.data;
}

export async function search_users(query: string) {
  const response = await api_client.get<UserSearchResult[]>('/user/search', {
    params: {
      query,
    },
  });

  return response.data;
}

export async function fetch_user_key_bundle(public_key: string) {
  const response = await api_client.get<UserKeyBundle>('/user/key_bundle', {
    params: {
      public_key,
    },
  });

  return response.data;
}
