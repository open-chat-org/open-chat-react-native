import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Box, VStack } from 'native-base';
import { ReactNode } from 'react';
import { ThemeMode } from '../app/theme/theme';
import { get_route_definition, tab_route_config } from '../shared/config/routes.config';
import { AppIconName } from '../types/icon.types';
import { RootStackParamList, TabRouteName } from '../types/navigation.types';
import { AppHeader } from './AppHeader';
import { BottomTabBar } from './BottomTabBar';

type AppLayoutProps = {
  children: ReactNode;
  header_context_label?: string;
  header_right_actions?: {
    icon: AppIconName;
    label?: string;
    on_press?: () => void;
    tone?: 'primary' | 'secondary';
  }[];
  header_subtitle?: string;
  header_title?: string;
  route_name: keyof RootStackParamList;
  theme_mode: ThemeMode;
};

const header_context_labels: Record<keyof RootStackParamList, string> = {
  chat_thread: 'Conversation',
  chat_list: 'Encrypted',
  create_account: 'Welcome',
  identity_details: 'Identity',
  profile_settings: 'Profile',
  settings: 'Private',
};

const header_subtitles: Record<keyof RootStackParamList, string> = {
  chat_thread: 'Local encrypted thread preview.',
  chat_list: 'Your local conversations and network-ready contacts.',
  create_account: 'Create a device identity to start secure messaging.',
  identity_details: 'Share your public key and protect your private key.',
  profile_settings: 'Adjust the details people see when they discover you.',
  settings: 'Manage profile, keys, and privacy preferences.',
};

export function AppLayout({
  children,
  header_context_label,
  header_right_actions,
  header_subtitle,
  header_title,
  route_name,
  theme_mode,
}: AppLayoutProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route_definition = get_route_definition(route_name);
  const can_go_back = !route_definition?.needs_tab_bar && navigation.canGoBack();
  const default_right_actions =
    route_name === 'chat_list'
      ? [
          {
            icon: 'plus' as const,
            label: 'Create conversation',
            tone: 'primary' as const,
          },
          {
            icon: 'dots-three-outline' as const,
            label: 'More options',
          },
        ]
      : route_name === 'settings'
        ? [
            {
              icon: 'dots-three-outline' as const,
              label: 'More options',
            },
          ]
        : [];
  const right_actions = header_right_actions ?? default_right_actions;

  return (
    <Box flex={1} safeArea bg={theme_mode === 'dark' ? 'surface.900' : 'surface.50'}>
      <VStack flex={1}>
        <Box px={4} pb={2} pt={4}>
          <Box
            rounded="3xl"
            bg={theme_mode === 'dark' ? 'panel.100' : 'panel.50'}
            px={4}
            py={3}
            borderWidth={1}
            borderColor={theme_mode === 'dark' ? 'panel.50' : 'surface.200'}
            shadow={theme_mode === 'dark' ? 0 : 2}
          >
            <AppHeader
              can_go_back={can_go_back}
              context_label={
                header_context_label ?? header_context_labels[route_name]
              }
              on_go_back={() => navigation.goBack()}
              right_actions={right_actions}
              subtitle={header_subtitle ?? header_subtitles[route_name]}
              theme_mode={theme_mode}
              title={header_title ?? route_definition?.name ?? 'Open Chat'}
            />
          </Box>
        </Box>

        <Box flex={1}>{children}</Box>

        {route_definition?.needs_tab_bar ? (
          <Box px={4} pb={4} pt={2}>
            <BottomTabBar
              active_route={route_name as TabRouteName}
              on_change_route={(target_route) => navigation.navigate(target_route)}
              routes={tab_route_config}
              theme_mode={theme_mode}
            />
          </Box>
        ) : null}
      </VStack>
    </Box>
  );
}
