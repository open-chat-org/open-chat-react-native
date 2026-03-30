import { ComponentType } from 'react';
import { ThemeMode } from '../../app/theme/theme';
import { ChatList } from '../../screens/ChatList';
import { CreateAccount } from '../../screens/CreateAccount';
import { IdentityDetails } from '../../screens/IdentityDetails';
import { ProfileSettings } from '../../screens/ProfileSettings';
import { Settings } from '../../screens/Settings';
import { ProtectedRouteName, RootStackParamList, TabRouteName } from '../../types/navigation.types';

export type RouteComponentProps = {
  on_account_created?: () => Promise<void>;
  public_key?: string;
  theme_mode: ThemeMode;
};

export type RouteDefinition = {
  component: ComponentType<RouteComponentProps>;
  icon?: string;
  name: string;
  needs_tab_bar: boolean;
  route: keyof RootStackParamList;
};

export const route_config: RouteDefinition[] = [
  {
    component: CreateAccount,
    name: 'Create Account',
    needs_tab_bar: false,
    route: 'create_account',
  },
  {
    component: ChatList,
    icon: 'chat',
    name: 'Chats',
    needs_tab_bar: true,
    route: 'chat_list',
  },
  {
    component: Settings,
    icon: 'settings',
    name: 'Settings',
    needs_tab_bar: true,
    route: 'settings',
  },
  {
    component: ProfileSettings,
    name: 'Profile Details',
    needs_tab_bar: false,
    route: 'profile_settings',
  },
  {
    component: IdentityDetails,
    name: 'Identity Details',
    needs_tab_bar: false,
    route: 'identity_details',
  },
];

export const protected_route_config = route_config.filter(
  (route): route is RouteDefinition & { route: ProtectedRouteName } =>
    route.route !== 'create_account',
);

export const auth_route_config = route_config.filter(
  (route): route is RouteDefinition & { route: 'create_account' } =>
    route.route === 'create_account',
);

export const tab_route_config = route_config.filter(
  (route): route is RouteDefinition & { route: TabRouteName } => route.needs_tab_bar,
);

export function get_route_definition(route_name: keyof RootStackParamList) {
  return route_config.find((route) => route.route === route_name);
}
