import { Box, HStack, Pressable, Text, VStack } from 'native-base';
import { ThemeMode } from '../app/theme/theme';

type SettingsMenuItemProps = {
  description: string;
  on_press: () => void;
  theme_mode: ThemeMode;
  title: string;
};

export function SettingsMenuItem({
  description,
  on_press,
  theme_mode,
  title,
}: SettingsMenuItemProps) {
  const is_dark = theme_mode === 'dark';

  return (
    <Pressable onPress={on_press}>
      <Box
        rounded="2xl"
        bg={is_dark ? 'panel.50' : 'white'}
        px={4}
        py={4}
        borderWidth={1}
        borderColor={is_dark ? 'panel.50' : 'surface.200'}
      >
        <HStack alignItems="center" justifyContent="space-between" space={4}>
          <VStack flex={1} space={1}>
            <Text color={is_dark ? 'white' : 'surface.900'} fontSize="sm" fontWeight="semibold">
              {title}
            </Text>
            <Text color={is_dark ? 'surface.100' : 'surface.700'} fontSize="xs">
              {description}
            </Text>
          </VStack>

          <Text color="brand.500" fontSize="lg" fontWeight="bold">
            {'>'}
          </Text>
        </HStack>
      </Box>
    </Pressable>
  );
}
