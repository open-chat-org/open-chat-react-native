export type CreateAccountResult = {
  public_key: string;
  private_key_saved: boolean;
};

export type LocalIdentity = {
  ed25519_private_key: string | null;
  ed25519_public_key: string | null;
  has_identity: boolean;
  x25519_private_key: string | null;
  x25519_public_key: string | null;
};
