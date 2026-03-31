import { get_ed25519_private_key } from '../storage/private-key.storage';
import { add_hex_prefix, sign_sha256_message } from './ed25519.service';

type SignableX25519PublicKeyPayload = {
  x25519_public_key: string;
};

export type SignedX25519PublicKeyPayload = SignableX25519PublicKeyPayload & {
  x25519_public_key_hash: string;
  x25519_public_key_signature: string;
};

export function normalize_x25519_public_key_payload(
  payload: SignableX25519PublicKeyPayload,
) {
  return {
    x25519_public_key: add_hex_prefix(payload.x25519_public_key.trim()),
  };
}

export function create_x25519_public_key_signature_message(
  payload: SignableX25519PublicKeyPayload,
) {
  const normalized_payload = normalize_x25519_public_key_payload(payload);

  return JSON.stringify({
    x25519_public_key: normalized_payload.x25519_public_key,
  });
}

export async function create_signed_x25519_public_key_payload(
  payload: SignableX25519PublicKeyPayload,
): Promise<SignedX25519PublicKeyPayload> {
  const private_key = await get_ed25519_private_key();

  if (!private_key) {
    throw new Error('Ed25519 private key is not available on this device.');
  }

  const normalized_payload = normalize_x25519_public_key_payload(payload);
  const signature_payload = await sign_sha256_message(
    create_x25519_public_key_signature_message(normalized_payload),
    private_key,
  );

  return {
    ...normalized_payload,
    x25519_public_key_hash: signature_payload.message_hash,
    x25519_public_key_signature: signature_payload.signature,
  };
}
