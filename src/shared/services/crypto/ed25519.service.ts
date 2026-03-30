import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';

ed.hashes.sha512 = sha512;
ed.hashes.sha512Async = async (message: Uint8Array) => sha512(message);

export type Ed25519KeyPair = {
  private_key: string;
  public_key: string;
};

export async function create_ed25519_key_pair(): Promise<Ed25519KeyPair> {
  const { secretKey, publicKey } = await ed.keygenAsync();

  return {
    private_key: ed.etc.bytesToHex(secretKey),
    public_key: ed.etc.bytesToHex(publicKey),
  };
}
