import { useRoute } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Center, Spinner } from 'native-base';
import { useEffect } from 'react';
import { RealtimeProvider } from '../context/realtime.context';
import { AppLayout } from '../../components/AppLayout';
import { CreateAccount } from '../../screens/CreateAccount';
import { ChatList } from '../../screens/ChatList';
import { ChatThread } from '../../screens/ChatThread';
import { IdentityDetails } from '../../screens/IdentityDetails';
import { ProfileSettings } from '../../screens/ProfileSettings';
import { Settings } from '../../screens/Settings';
import { useAppSession } from '../../hooks/useAppSession';
import { useServerStore } from '../../store/server.store';
import { RootStackParamList } from '../../types/navigation.types';
import { AppShellProvider, useAppShell } from '../context/app_shell.context';
import { ThemeMode } from '../theme/theme';

type AppRouterProps = {
  theme_mode: ThemeMode;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function CreateAccountRoute() {
  const { refresh_session, theme_mode } = useAppShell();

  return (
    <CreateAccount
      on_account_created={refresh_session}
      theme_mode={theme_mode}
    />
  );
}

function ChatListRoute() {
  const { public_key, theme_mode } = useAppShell();

  return (
    <AppLayout route_name="chat_list" theme_mode={theme_mode}>
      <ChatList public_key={public_key} theme_mode={theme_mode} />
    </AppLayout>
  );
}

function SettingsRoute() {
  const { theme_mode } = useAppShell();

  return (
    <AppLayout route_name="settings" theme_mode={theme_mode}>
      <Settings theme_mode={theme_mode} />
    </AppLayout>
  );
}

function ProfileSettingsRoute() {
  const { public_key, theme_mode } = useAppShell();

  return (
    <AppLayout route_name="profile_settings" theme_mode={theme_mode}>
      <ProfileSettings public_key={public_key} theme_mode={theme_mode} />
    </AppLayout>
  );
}

function IdentityDetailsRoute() {
  const { public_key, theme_mode } = useAppShell();

  return (
    <AppLayout route_name="identity_details" theme_mode={theme_mode}>
      <IdentityDetails public_key={public_key} theme_mode={theme_mode} />
    </AppLayout>
  );
}

function ChatThreadRoute() {
  const { public_key, theme_mode } = useAppShell();
  const route = useRoute();
  const params = route.params as RootStackParamList['chat_thread'];

  return (
    <ChatThread
      chat_id={params?.chat_id}
      chat_subtitle={params?.chat_subtitle}
      chat_title={params?.chat_title}
      public_key={public_key}
      theme_mode={theme_mode}
    />
  );
}

function AuthenticatedRoutes() {
  const { public_key } = useAppShell();

  return (
    <RealtimeProvider public_key={public_key}>
      <Stack.Navigator
        initialRouteName="chat_list"
        screenOptions={{
          animation: 'fade',
          headerShown: false,
        }}
      >
        <Stack.Screen component={ChatListRoute} name="chat_list" />
        <Stack.Screen component={ChatThreadRoute} name="chat_thread" />
        <Stack.Screen component={SettingsRoute} name="settings" />
        <Stack.Screen component={ProfileSettingsRoute} name="profile_settings" />
        <Stack.Screen component={IdentityDetailsRoute} name="identity_details" />
      </Stack.Navigator>
    </RealtimeProvider>
  );
}

export function AppRouter({ theme_mode }: AppRouterProps) {
  const { identity, is_loading_session, refresh_session } = useAppSession();
  const fetch_server_public_key = useServerStore(
    (state) => state.fetch_server_public_key,
  );

  useEffect(() => {
    void fetch_server_public_key();
  }, [fetch_server_public_key]);

  if (is_loading_session) {
    return (
      <Center flex={1} bg={theme_mode === 'dark' ? 'surface.900' : 'surface.50'}>
        <Spinner color="brand.500" size="lg" />
      </Center>
    );
  }

  return (
    <AppShellProvider
      value={{
        public_key: identity.ed25519_public_key ?? '',
        refresh_session,
        theme_mode,
      }}
    >
      <NavigationContainer key={identity.has_identity ? 'authenticated' : 'anonymous'}>
        {identity.has_identity ? (
          <AuthenticatedRoutes />
        ) : (
          <Stack.Navigator
            initialRouteName="create_account"
            screenOptions={{
              animation: 'fade',
              headerShown: false,
            }}
          >
            <Stack.Screen component={CreateAccountRoute} name="create_account" />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AppShellProvider>
  );
}
