export type RootStackParamList = {
  create_account: undefined;
  chat_list: undefined;
  settings: undefined;
  profile_settings: undefined;
  identity_details: undefined;
};

export type ProtectedRouteName = Exclude<keyof RootStackParamList, 'create_account'>;
export type TabRouteName = 'chat_list' | 'settings';
