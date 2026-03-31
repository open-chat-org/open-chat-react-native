import { useEffect, useState } from 'react';
import { reconcile_local_identity } from '../services/account-registration.service';
import {
  initialize_local_chat_database,
  remove_dummy_chats,
} from '../services/local-chat-database.service';
import { get_local_identity } from '../shared/services/storage/private-key.storage';
import { LocalIdentity } from '../types/account.types';

export function useAppSession() {
  const [is_loading_session, set_is_loading_session] = useState(true);
  const [identity, set_identity] = useState<LocalIdentity>({
    ed25519_private_key: null,
    ed25519_public_key: null,
    has_identity: false,
    x25519_private_key: null,
    x25519_public_key: null,
  });

  const refresh_session = async () => {
    try {
      set_is_loading_session(true);
      await initialize_local_chat_database();
      await remove_dummy_chats();

      try {
        await reconcile_local_identity();
      } catch {
        // Reconciliation is best-effort for existing installs.
      }

      const local_identity = await get_local_identity();
      set_identity(local_identity);
    } finally {
      set_is_loading_session(false);
    }
  };

  useEffect(() => {
    void refresh_session();
  }, []);

  return {
    identity,
    is_loading_session,
    refresh_session,
  };
}
