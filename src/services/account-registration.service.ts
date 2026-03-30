import { register_public_key } from '../shared/services/api/account.api';
import {
  create_ed25519_key_pair,
} from '../shared/services/crypto/ed25519.service';
import {
  save_private_key,
  save_public_key,
} from '../shared/services/storage/private-key.storage';
import { CreateAccountResult } from '../types/account.types';

export async function create_account_registration(): Promise<CreateAccountResult> {
  const key_pair = await create_ed25519_key_pair();

  await save_private_key(key_pair.private_key);
  await save_public_key(key_pair.public_key);
  await register_public_key();

  return {
    public_key: key_pair.public_key,
    private_key_saved: true,
  };
}
