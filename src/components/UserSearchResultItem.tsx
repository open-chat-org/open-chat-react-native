import { Box, HStack, Pressable, Text, VStack } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { truncate_hex } from '../shared/utils/hex';
import { UserSearchResult } from '../types/user.types';

type UserSearchResultItemProps = {
  on_press: () => void;
  theme_mode: ThemeMode;
  user: UserSearchResult;
};

function get_display_title(user: UserSearchResult) {
  const normalized_name = user.name?.trim();

  if (normalized_name) {
    return normalized_name;
  }

  const normalized_username = user.username?.trim();

  if (normalized_username) {
    return `@${normalized_username}`;
  }

  return truncate_hex(user.public_key, 8);
}

function get_display_subtitle(user: UserSearchResult) {
  const normalized_username = user.username?.trim();

  if (normalized_username) {
    return `@${normalized_username}`;
  }

  return 'Discovered on this node';
}

function get_avatar_label(user: UserSearchResult) {
  const title = get_display_title(user).replace('@', '').trim();

  return title.slice(0, 2).toUpperCase();
}

export function UserSearchResultItem({
  on_press,
  theme_mode,
  user,
}: UserSearchResultItemProps) {
  const is_dark = theme_mode === 'dark';

  return (
    <Pressable onPress={on_press}>
      <Box
        px={3}
        py={3}
        rounded="xl"
        bg={is_dark ? 'panel.100' : 'white'}
        borderWidth={1}
        borderColor={is_dark ? 'panel.50' : 'surface.200'}
      >
        <HStack alignItems="center" justifyContent="space-between" space={3}>
          <HStack flex={1} alignItems="center" space={3}>
            <Box
              h="48px"
              w="48px"
              rounded="full"
              alignItems="center"
              justifyContent="center"
              bg={is_dark ? 'surface.800' : 'surface.100'}
            >
              <Text
                color={is_dark ? 'surface.50' : 'surface.900'}
                fontSize="sm"
                fontWeight="bold"
              >
                {get_avatar_label(user)}
              </Text>
            </Box>

            <VStack flex={1} space={1}>
              <Text
                color={is_dark ? 'white' : 'surface.900'}
                fontSize="sm"
                fontWeight="semibold"
              >
                {get_display_title(user)}
              </Text>
              <Text
                color={is_dark ? 'surface.100' : 'surface.700'}
                fontSize="xs"
                numberOfLines={1}
              >
                {get_display_subtitle(user)}
              </Text>
              <Text
                color={is_dark ? 'surface.200' : 'surface.800'}
                fontSize="xs"
                numberOfLines={1}
              >
                {truncate_hex(user.public_key, 12)}
              </Text>
            </VStack>
          </HStack>

          <Text color="brand.500" fontSize="xs" fontWeight="bold">
            ADD
          </Text>
        </HStack>
      </Box>
    </Pressable>
  );
}
