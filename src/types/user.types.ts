export type UserProfile = {
  email: string | null;
  name: string | null;
  phone: string | null;
  public_key: string;
  quote: string | null;
  username: string | null;
};

export type SaveUserProfilePayload = {
  email: string;
  name: string;
  phone: string;
  quote: string;
  username: string;
};

export type SignedUserProfilePayload = SaveUserProfilePayload & {
  profile_hash: string;
  profile_signature: string;
};

export type UserSearchResult = {
  name: string | null;
  public_key: string;
  username: string | null;
};
