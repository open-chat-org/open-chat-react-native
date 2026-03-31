import { Box, HStack, Text, VStack } from 'native-base';
import { useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';
import { ThemeMode } from '../app/theme/theme';
import { AppIconName } from '../types/icon.types';
import { AppIcon } from './AppIcon';

type SettingsMenuItemProps = {
  description: string;
  icon: AppIconName;
  on_press: () => void;
  theme_mode: ThemeMode;
  title: string;
};

export function SettingsMenuItem({
  description,
  icon,
  on_press,
  theme_mode,
  title,
}: SettingsMenuItemProps) {
  const is_dark = theme_mode === 'dark';
  const scale_animation = useRef(new Animated.Value(1)).current;
  const opacity_animation = useRef(new Animated.Value(1)).current;

  const animate_to = (next_scale: number, next_opacity: number) => {
    Animated.parallel([
      Animated.timing(scale_animation, {
        duration: 150,
        easing: Easing.out(Easing.quad),
        toValue: next_scale,
        useNativeDriver: true,
      }),
      Animated.timing(opacity_animation, {
        duration: 150,
        easing: Easing.out(Easing.quad),
        toValue: next_opacity,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={on_press}
      onPressIn={() => animate_to(0.985, 0.96)}
      onPressOut={() => animate_to(1, 1)}
    >
      <Animated.View
        style={{
          opacity: opacity_animation,
          transform: [{ scale: scale_animation }],
        }}
      >
        <Box
          rounded="2xl"
          bg={is_dark ? 'panel.50' : 'white'}
          px={4}
          py={4}
          borderWidth={1}
          borderColor={is_dark ? 'panel.50' : 'surface.200'}
        >
          <HStack alignItems="center" justifyContent="space-between" space={4}>
            <HStack flex={1} alignItems="center" space={3}>
              <Box
                alignItems="center"
                bg={is_dark ? 'surface.800' : 'brand.50'}
                h="44px"
                justifyContent="center"
                rounded="full"
                w="44px"
              >
                <AppIcon
                  color={is_dark ? '#d8e3ea' : '#13ae80'}
                  name={icon}
                  size={20}
                  weight="regular"
                />
              </Box>

              <VStack flex={1} space={1}>
                <Text color={is_dark ? 'white' : 'surface.900'} fontSize="sm" fontWeight="semibold">
                  {title}
                </Text>
                <Text color={is_dark ? 'surface.100' : 'surface.700'} fontSize="xs">
                  {description}
                </Text>
              </VStack>
            </HStack>

            <Box>
              <AppIcon
                color="#13ae80"
                name="caret-right"
                size={18}
                weight="bold"
              />
            </Box>
          </HStack>
        </Box>
      </Animated.View>
    </Pressable>
  );
}
