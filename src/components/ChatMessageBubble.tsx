import { Box, Text } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { ChatMessage } from '../types/chat.types';

type ChatMessageBubbleProps = {
  is_outgoing: boolean;
  message: ChatMessage;
  theme_mode: ThemeMode;
};

export function ChatMessageBubble({
  is_outgoing,
  message,
  theme_mode,
}: ChatMessageBubbleProps) {
  const is_dark = theme_mode === 'dark';
  const message_time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Box
      alignSelf={is_outgoing ? 'flex-end' : 'flex-start'}
      maxW="82%"
      px={3}
      py={2}
      rounded="xl"
      bg={
        is_outgoing
          ? is_dark
            ? 'brand.700'
            : 'brand.100'
          : is_dark
            ? 'panel.100'
            : 'white'
      }
      borderWidth={is_outgoing ? 0 : 1}
      borderColor={is_dark ? 'panel.50' : 'surface.200'}
      shadow={is_dark ? 0 : 1}
    >
      <Text
        color={
          is_outgoing
            ? is_dark
              ? 'white'
              : 'surface.900'
            : is_dark
              ? 'surface.50'
              : 'surface.900'
        }
        fontSize="sm"
        lineHeight="md"
      >
        {message.encrypted_content}
      </Text>
      <Text
        color={
          is_outgoing
            ? is_dark
              ? 'brand.50'
              : 'surface.700'
            : is_dark
              ? 'surface.200'
              : 'surface.700'
        }
        fontSize="2xs"
        mt={1}
        textAlign="right"
      >
        {message_time}
      </Text>
    </Box>
  );
}
