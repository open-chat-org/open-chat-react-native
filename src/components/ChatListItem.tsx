import { Badge, Box, HStack, Pressable, Text, VStack } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { ChatSummary } from '../types/chat.types';

type ChatListItemProps = {
  chat: ChatSummary;
  theme_mode: ThemeMode;
};

export function ChatListItem({ chat, theme_mode }: ChatListItemProps) {
  const is_dark = theme_mode === 'dark';

  return (
    <Pressable>
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
              bg={chat.unread_count > 0 ? 'brand.500' : is_dark ? 'surface.800' : 'surface.100'}
            >
              <Text color={chat.unread_count > 0 ? 'white' : is_dark ? 'surface.50' : 'surface.900'} fontSize="sm" fontWeight="bold">
                {chat.title.slice(0, 2).toUpperCase()}
              </Text>
            </Box>

            <VStack flex={1} space={1}>
              <Text color={is_dark ? 'white' : 'surface.900'} fontSize="sm" fontWeight="semibold">
                {chat.title}
              </Text>
              <Text color={is_dark ? 'surface.100' : 'surface.700'} fontSize="xs" numberOfLines={1}>
                {chat.subtitle}
              </Text>
              <Text
                color={is_dark ? 'surface.200' : 'surface.800'}
                fontSize="xs"
                numberOfLines={1}
              >
                {chat.last_message_preview}
              </Text>
            </VStack>
          </HStack>

          <VStack alignItems="flex-end" space={2}>
            <Text color={is_dark ? 'surface.200' : 'surface.700'} fontSize="xs">
              {chat.last_message_at}
            </Text>
            {chat.unread_count > 0 ? (
              <Badge colorScheme="emerald" rounded="full" _text={{ fontSize: 'xs' }}>
                {chat.unread_count}
              </Badge>
            ) : (
              <Box h="20px" />
            )}
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
}
