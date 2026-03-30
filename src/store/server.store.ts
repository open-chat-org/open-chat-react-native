import { create } from 'zustand';
import { fetch_server_public_key } from '../shared/services/api/server.api';

type ServerStore = {
  fetch_server_public_key: () => Promise<void>;
  is_loading_server_public_key: boolean;
  server_public_key: string;
  server_public_key_error: string;
};

export const useServerStore = create<ServerStore>((set, get) => ({
  fetch_server_public_key: async () => {
    const current_public_key = get().server_public_key;
    const is_loading_server_public_key = get().is_loading_server_public_key;

    if (current_public_key || is_loading_server_public_key) {
      return;
    }

    try {
      set({
        is_loading_server_public_key: true,
        server_public_key_error: '',
      });

      const server_identity = await fetch_server_public_key();

      set({
        is_loading_server_public_key: false,
        server_public_key: server_identity.public_key,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load the server public key.';

      set({
        is_loading_server_public_key: false,
        server_public_key_error: message,
      });
    }
  },
  is_loading_server_public_key: false,
  server_public_key: '',
  server_public_key_error: '',
}));
