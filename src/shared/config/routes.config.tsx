import { ComponentType } from 'react';
import { ThemeMode } from '../../app/theme/theme';
import { ChatList } from '../../screens/ChatList';
import { ChatThread } from '../../screens/ChatThread';
import { CreateAccount } from '../../screens/CreateAccount';
import { IdentityDetails } from '../../screens/IdentityDetails';
import { ProfileSettings } from '../../screens/ProfileSettings';
import { Settings } from '../../screens/Settings';
import type { AppIconName } from '../../types/icon.types';
import { ProtectedRouteName, RootStackParamList, TabRouteName } from '../../types/navigation.types';

export type RouteComponentProps = {
  chat_id?: string;
  on_account_created?: () => Promise<void>;
  public_key?: string;
  theme_mode: ThemeMode;
};

export type RouteDefinition = {
  component: ComponentType<RouteComponentProps>;
  icon?: AppIconName;
  name: string;
  needs_tab_bar: boolean;
  route: keyof RootStackParamList;
};

export type TabRouteDefinition = RouteDefinition & {
  icon: AppIconName;
  route: TabRouteName;
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
    icon: 'chat-circle-dots',
    name: 'Chats',
    needs_tab_bar: true,
    route: 'chat_list',
  },
  {
    component: ChatThread,
    name: 'Conversation',
    needs_tab_bar: false,
    route: 'chat_thread',
  },
  {
    component: Settings,
    icon: 'gear-six',
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
  (route): route is TabRouteDefinition =>
    route.needs_tab_bar && route.icon !== undefined,
);

export function get_route_definition(route_name: keyof RootStackParamList) {
  return route_config.find((route) => route.route === route_name);
}
