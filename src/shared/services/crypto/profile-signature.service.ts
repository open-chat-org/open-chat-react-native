import { get_ed25519_private_key } from '../storage/private-key.storage';
import { sign_sha256_message } from './ed25519.service';

type SignableProfilePayload = {
  email: string;
  name: string;
  phone: string;
  quote: string;
  username: string;
};

export type SignedProfilePayload = SignableProfilePayload & {
  profile_hash: string;
  profile_signature: string;
};

export function normalize_profile_payload(payload: SignableProfilePayload) {
  return {
    username: payload.username.trim(),
    name: payload.name.trim(),
    quote: payload.quote.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
  };
}

export function create_profile_signature_message(payload: SignableProfilePayload) {
  const normalized_payload = normalize_profile_payload(payload);

  return JSON.stringify({
    username: normalized_payload.username,
    name: normalized_payload.name,
    quote: normalized_payload.quote,
    phone: normalized_payload.phone,
    email: normalized_payload.email,
  });
}

export async function create_signed_profile_payload(
  payload: SignableProfilePayload,
): Promise<SignedProfilePayload> {
  const private_key = await get_ed25519_private_key();

  if (!private_key) {
    throw new Error('Ed25519 private key is not available on this device.');
  }

  const normalized_payload = normalize_profile_payload(payload);
  const signature_payload = await sign_sha256_message(
    create_profile_signature_message(normalized_payload),
    private_key,
  );

  return {
    ...normalized_payload,
    profile_hash: signature_payload.message_hash,
    profile_signature: signature_payload.signature,
  };
}
