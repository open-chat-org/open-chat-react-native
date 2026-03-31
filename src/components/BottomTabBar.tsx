import { HStack, Text, VStack } from 'native-base';
import { useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';
import { ThemeMode } from '../app/theme/theme';
import { TabRouteDefinition } from '../shared/config/routes.config';
import { TabRouteName } from '../types/navigation.types';
import { MotionTabIcon } from './MotionTabIcon';

type BottomTabBarProps = {
  active_route: TabRouteName;
  on_change_route: (route: TabRouteName) => void;
  routes: TabRouteDefinition[];
  theme_mode: ThemeMode;
};

type BottomTabBarItemProps = {
  is_active: boolean;
  on_press: () => void;
  route: TabRouteDefinition;
  theme_mode: ThemeMode;
};

function BottomTabBarItem({
  is_active,
  on_press,
  route,
  theme_mode,
}: BottomTabBarItemProps) {
  const is_dark = theme_mode === 'dark';
  const press_scale = useRef(new Animated.Value(1)).current;

  const animate_to = (next_value: number) => {
    Animated.timing(press_scale, {
      duration: 140,
      easing: Easing.out(Easing.quad),
      toValue: next_value,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={on_press}
      onPressIn={() => animate_to(0.97)}
      onPressOut={() => animate_to(1)}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={{
          transform: [{ scale: press_scale }],
        }}
      >
        <VStack
          alignItems="center"
          bg={is_active ? 'brand.500' : 'transparent'}
          px={3}
          py={2.5}
          rounded="full"
          space={1}
        >
          <MotionTabIcon
            active={is_active}
            active_color="#ffffff"
            inactive_color={is_dark ? '#d8e3ea' : '#17212b'}
            name={route.icon}
            size={20}
          />
          <Text
            color={is_active ? 'white' : is_dark ? 'surface.50' : 'surface.900'}
            fontSize="xs"
            fontWeight="semibold"
          >
            {route.name}
          </Text>
        </VStack>
      </Animated.View>
    </Pressable>
  );
}

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
        return (
          <BottomTabBarItem
            key={route.route}
            is_active={active_route === route.route}
            on_press={() => on_change_route(route.route)}
            route={route}
            theme_mode={theme_mode}
          />
        );
      })}
    </HStack>
  );
}
