import { x25519 } from '@noble/curves/ed25519.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { add_hex_prefix } from './ed25519.service';

export type X25519KeyPair = {
  private_key: string;
  public_key: string;
};

export function create_x25519_key_pair(): X25519KeyPair {
  const private_key = x25519.utils.randomSecretKey();
  const public_key = x25519.getPublicKey(private_key);

  return {
    private_key: add_hex_prefix(bytesToHex(private_key)),
    public_key: add_hex_prefix(bytesToHex(public_key)),
  };
}
