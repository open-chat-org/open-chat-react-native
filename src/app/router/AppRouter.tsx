import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Center, Spinner } from 'native-base';
import { useEffect } from 'react';
import { AppLayout } from '../../components/AppLayout';
import {
  RouteDefinition,
  auth_route_config,
  protected_route_config,
} from '../../shared/config/routes.config';
import { useAppSession } from '../../hooks/useAppSession';
import { useServerStore } from '../../store/server.store';
import { RootStackParamList } from '../../types/navigation.types';
import { ThemeMode } from '../theme/theme';

type AppRouterProps = {
  theme_mode: ThemeMode;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function render_route_screen(
  route_definition: RouteDefinition,
  theme_mode: ThemeMode,
  public_key: string,
  refresh_session: () => Promise<void>,
) {
  const ScreenComponent = route_definition.component;

  if (route_definition.route === 'create_account') {
    return (
      <ScreenComponent
        on_account_created={refresh_session}
        public_key={public_key}
        theme_mode={theme_mode}
      />
    );
  }

  return (
    <AppLayout route_name={route_definition.route} theme_mode={theme_mode}>
      <ScreenComponent public_key={public_key} theme_mode={theme_mode} />
    </AppLayout>
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

  const available_routes = identity.has_identity
    ? protected_route_config
    : auth_route_config;

  return (
    <NavigationContainer key={identity.has_identity ? 'authenticated' : 'anonymous'}>
      <Stack.Navigator
        initialRouteName={identity.has_identity ? 'chat_list' : 'create_account'}
        screenOptions={{
          animation: 'fade',
          headerShown: false,
        }}
      >
        {available_routes.map((route_definition) => (
          <Stack.Screen key={route_definition.route} name={route_definition.route}>
            {() =>
              render_route_screen(
                route_definition,
                theme_mode,
                identity.public_key ?? '',
                refresh_session,
              )
            }
          </Stack.Screen>
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
