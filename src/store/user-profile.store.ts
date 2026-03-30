import { create } from 'zustand';
import {
  fetch_user_profile,
  save_user_profile,
} from '../shared/services/api/user.api';
import { SaveUserProfilePayload, UserProfile } from '../types/user.types';

type UserProfileStore = {
  fetch_user_profile: () => Promise<void>;
  is_loading_user_profile: boolean;
  is_saving_user_profile: boolean;
  reset_user_profile_feedback: () => void;
  save_user_profile: (payload: SaveUserProfilePayload) => Promise<UserProfile | null>;
  user_profile: UserProfile | null;
  user_profile_error: string;
  user_profile_success_message: string;
};

export const useUserProfileStore = create<UserProfileStore>((set) => ({
  fetch_user_profile: async () => {
    try {
      set({
        is_loading_user_profile: true,
        user_profile_error: '',
      });

      const user_profile = await fetch_user_profile();

      set({
        is_loading_user_profile: false,
        user_profile,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load the user profile.';

      set({
        is_loading_user_profile: false,
        user_profile_error: message,
      });
    }
  },
  is_loading_user_profile: false,
  is_saving_user_profile: false,
  reset_user_profile_feedback: () =>
    set({
      user_profile_error: '',
      user_profile_success_message: '',
    }),
  save_user_profile: async (payload: SaveUserProfilePayload) => {
    try {
      set({
        is_saving_user_profile: true,
        user_profile_error: '',
        user_profile_success_message: '',
      });

      const user_profile = await save_user_profile(payload);

      set({
        is_saving_user_profile: false,
        user_profile,
        user_profile_success_message: 'Profile saved successfully.',
      });

      return user_profile;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to save the user profile.';

      set({
        is_saving_user_profile: false,
        user_profile_error: message,
      });

      return null;
    }
  },
  user_profile: null,
  user_profile_error: '',
  user_profile_success_message: '',
}));
