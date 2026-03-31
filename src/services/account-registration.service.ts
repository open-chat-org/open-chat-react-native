import {
  register_public_key,
  register_x25519_public_key,
} from '../shared/services/api/account.api';
import {
  create_ed25519_key_pair,
} from '../shared/services/crypto/ed25519.service';
import { create_x25519_key_pair } from '../shared/services/crypto/x25519.service';
import { create_signed_x25519_public_key_payload } from '../shared/services/crypto/x25519-public-key-signature.service';
import {
  get_local_identity,
  save_ed25519_private_key,
  save_ed25519_public_key,
  save_x25519_private_key,
  save_x25519_public_key,
} from '../shared/services/storage/private-key.storage';
import { CreateAccountResult } from '../types/account.types';

export async function create_account_registration(): Promise<CreateAccountResult> {
  const ed25519_key_pair = await create_ed25519_key_pair();
  const x25519_key_pair = create_x25519_key_pair();

  await save_ed25519_private_key(ed25519_key_pair.private_key);
  await save_ed25519_public_key(ed25519_key_pair.public_key);
  await save_x25519_private_key(x25519_key_pair.private_key);
  await save_x25519_public_key(x25519_key_pair.public_key);
  await register_public_key();
  await register_x25519_public_key(
    await create_signed_x25519_public_key_payload({
      x25519_public_key: x25519_key_pair.public_key,
    }),
  );

  return {
    public_key: ed25519_key_pair.public_key,
    private_key_saved: true,
  };
}

export async function reconcile_local_identity() {
  const local_identity = await get_local_identity();

  if (!local_identity.ed25519_private_key || !local_identity.ed25519_public_key) {
    return local_identity;
  }

  let x25519_public_key = local_identity.x25519_public_key;

  if (!local_identity.x25519_private_key || !local_identity.x25519_public_key) {
    const x25519_key_pair = create_x25519_key_pair();

    await save_x25519_private_key(x25519_key_pair.private_key);
    await save_x25519_public_key(x25519_key_pair.public_key);
    x25519_public_key = x25519_key_pair.public_key;
  }

  if (x25519_public_key) {
    await register_x25519_public_key(
      await create_signed_x25519_public_key_payload({
        x25519_public_key,
      }),
    );
  }

  return get_local_identity();
}
