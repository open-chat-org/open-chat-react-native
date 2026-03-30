import { Button, HStack } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { RouteDefinition } from '../shared/config/routes.config';
import { TabRouteName } from '../types/navigation.types';

type BottomTabBarProps = {
  active_route: TabRouteName;
  on_change_route: (route: TabRouteName) => void;
  routes: Array<RouteDefinition & { route: TabRouteName }>;
  theme_mode: ThemeMode;
};

export function BottomTabBar({
  active_route,
  on_change_route,
  routes,
  theme_mode,
}: BottomTabBarProps) {
  const is_dark = theme_mode === 'dark';

  return (
    <HStack
      space={3}
      bg={is_dark ? 'panel.100' : 'panel.50'}
      p={2}
      rounded="full"
      borderWidth={1}
      borderColor={is_dark ? 'panel.50' : 'surface.200'}
    >
      {routes.map((route) => {
        const is_active = active_route === route.route;

        return (
          <Button
            key={route.route}
            flex={1}
            bg={is_active ? 'brand.500' : 'transparent'}
            _pressed={{ bg: is_active ? 'brand.600' : is_dark ? 'surface.800' : 'surface.100' }}
            _text={{
              color: is_active ? 'white' : is_dark ? 'surface.50' : 'surface.900',
              fontWeight: 'semibold',
            }}
            onPress={() => on_change_route(route.route)}
          >
            {route.name}
          </Button>
        );
      })}
    </HStack>
  );
}
