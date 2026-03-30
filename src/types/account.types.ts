export type CreateAccountResult = {
  public_key: string;
  private_key_saved: boolean;
};

export type LocalIdentity = {
  has_identity: boolean;
  private_key: string | null;
  public_key: string | null;
};
