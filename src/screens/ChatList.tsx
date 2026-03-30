import { Box, Center, Input, ScrollView, Spinner, Text, VStack } from 'native-base';
import { useDeferredValue, useState } from 'react';
import { ThemeMode } from '../app/theme/theme';
import { ChatListItem } from '../components/ChatListItem';
import { useChatList } from '../hooks/useChatList';

type ChatListProps = {
  public_key?: string;
  theme_mode: ThemeMode;
};

export function ChatList({ theme_mode }: ChatListProps) {
  const { chat_summaries, is_loading_chats } = useChatList();
  const is_dark = theme_mode === 'dark';
  const [search_query, set_search_query] = useState('');
  const deferred_search_query = useDeferredValue(search_query);
  const filtered_chat_summaries = chat_summaries.filter((chat) => {
    const search_value = deferred_search_query.trim().toLowerCase();

    if (!search_value) {
      return true;
    }

    return [chat.title, chat.subtitle, chat.last_message_preview]
      .join(' ')
      .toLowerCase()
      .includes(search_value);
  });

  if (is_loading_chats) {
    return (
      <Center flex={1} bg={is_dark ? 'surface.900' : 'surface.50'}>
        <Spinner color="brand.500" size="lg" />
      </Center>
    );
  }

  return (
    <ScrollView
      flex={1}
      _contentContainerStyle={{
        px: 4,
        pb: 4,
        pt: 2,
      }}
    >
      <VStack space={3}>
        <VStack space={2}>
          <Text
            color={is_dark ? 'surface.100' : 'surface.700'}
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
          >
            Search
          </Text>
          <Input
            value={search_query}
            onChangeText={set_search_query}
            placeholder="Search chats, people, or nodes"
            bg={is_dark ? 'panel.100' : 'white'}
            color={is_dark ? 'white' : 'surface.900'}
            placeholderTextColor={is_dark ? '#8da4b5' : '#6b7f90'}
            px={5}
            py={3}
            borderWidth={1}
            borderColor={is_dark ? 'panel.50' : 'surface.200'}
            _focus={{
              bg: is_dark ? 'panel.100' : 'white',
            }}
          />
        </VStack>

        {filtered_chat_summaries.length > 0 ? (
          filtered_chat_summaries.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} theme_mode={theme_mode} />
          ))
        ) : (
          <Box
            rounded="3xl"
            bg={is_dark ? 'panel.100' : 'white'}
            px={5}
            py={6}
            borderWidth={1}
            borderColor={is_dark ? 'panel.50' : 'surface.200'}
          >
            <Text color={is_dark ? 'surface.50' : 'surface.900'} fontSize="md" fontWeight="semibold">
              No chats found
            </Text>
            <Text color={is_dark ? 'surface.200' : 'surface.700'} mt={1} fontSize="sm">
              Try a different name or node search term.
            </Text>
          </Box>
        )}
      </VStack>
    </ScrollView>
  );
}
