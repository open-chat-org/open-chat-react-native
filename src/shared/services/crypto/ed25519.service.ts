import * as ed from '@noble/ed25519';
import { sha256, sha512 } from '@noble/hashes/sha2.js';

ed.hashes.sha512 = sha512;
ed.hashes.sha512Async = async (message: Uint8Array) => sha512(message);

export type Ed25519KeyPair = {
  private_key: string;
  public_key: string;
};

export function add_hex_prefix(value: string) {
  return value.startsWith('0x') ? value : `0x${value}`;
}

export function remove_hex_prefix(value: string) {
  return value.startsWith('0x') ? value.slice(2) : value;
}

export async function create_ed25519_key_pair(): Promise<Ed25519KeyPair> {
  const { secretKey, publicKey } = await ed.keygenAsync();

  return {
    private_key: ed.etc.bytesToHex(secretKey),
    public_key: add_hex_prefix(ed.etc.bytesToHex(publicKey)),
  };
}

export async function sign_sha256_message(
  message: string,
  private_key: string,
) {
  const message_bytes = new TextEncoder().encode(message);
  const message_hash = sha256(message_bytes);
  const signature = await ed.signAsync(
    message_hash,
    ed.etc.hexToBytes(remove_hex_prefix(private_key)),
  );

  return {
    message_hash: add_hex_prefix(ed.etc.bytesToHex(message_hash)),
    signature: add_hex_prefix(ed.etc.bytesToHex(signature)),
  };
}

export async function sign_raw_message(
  message: string,
  private_key: string,
) {
  const signature = await ed.signAsync(
    new TextEncoder().encode(message),
    ed.etc.hexToBytes(remove_hex_prefix(private_key)),
  );

  return add_hex_prefix(ed.etc.bytesToHex(signature));
}

export async function verify_raw_message_signature(
  message: string,
  signature: string,
  public_key: string,
) {
  return ed.verifyAsync(
    ed.etc.hexToBytes(remove_hex_prefix(signature)),
    new TextEncoder().encode(message),
    ed.etc.hexToBytes(remove_hex_prefix(public_key)),
  );
}
