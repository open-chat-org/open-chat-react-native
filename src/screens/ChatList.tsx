import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Box, Center, ScrollView, Spinner, Text, VStack } from 'native-base';
import { useDeferredValue, useState } from 'react';
import { TextInput } from 'react-native';
import { ThemeMode } from '../app/theme/theme';
import { ChatListItem } from '../components/ChatListItem';
import { UserSearchResultItem } from '../components/UserSearchResultItem';
import { useChatList } from '../hooks/useChatList';
import { useUserSearch } from '../hooks/useUserSearch';
import { create_or_open_user_chat_stub } from '../services/local-chat-database.service';
import { RootStackParamList } from '../types/navigation.types';

type ChatListProps = {
  public_key?: string;
  theme_mode: ThemeMode;
};

export function ChatList({ theme_mode }: ChatListProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { chat_summaries, is_loading_chats, refresh_chats } = useChatList();
  const is_dark = theme_mode === 'dark';
  const [is_search_focused, set_is_search_focused] = useState(false);
  const [search_query, set_search_query] = useState('');
  const [chat_stub_error, set_chat_stub_error] = useState('');
  const deferred_search_query = useDeferredValue(search_query);
  const {
    has_search_query,
    is_loading_user_search,
    user_search_error,
    user_search_results,
  } = useUserSearch(search_query);
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

  const handle_select_user = async (
    public_key: string,
    name: string | null,
    username: string | null,
  ) => {
    try {
      set_chat_stub_error('');
      const chat_summary = await create_or_open_user_chat_stub({
        name,
        public_key,
        username,
      });
      await refresh_chats();
      navigation.navigate('chat_thread', {
        chat_id: chat_summary.id,
        chat_subtitle: chat_summary.subtitle,
        chat_title: chat_summary.title,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create a local chat for this user.';

      set_chat_stub_error(message);
    }
  };

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
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="always"
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
          <Box
            rounded="full"
            bg={is_dark ? 'panel.100' : 'white'}
            px={5}
            py={0}
            borderWidth={1}
            borderColor={is_search_focused ? 'brand.500' : is_dark ? 'panel.50' : 'surface.200'}
            minH="50px"
            justifyContent="center"
          >
            <TextInput
              onBlur={() => set_is_search_focused(false)}
              onChangeText={set_search_query}
              onFocus={() => set_is_search_focused(true)}
              placeholder="Search chats, people, or nodes"
              placeholderTextColor={is_dark ? '#8da4b5' : '#6b7f90'}
              selectionColor={is_dark ? '#d8e3ea' : '#17212b'}
              style={{
                color: is_dark ? '#ffffff' : '#17212b',
                fontSize: 14,
                paddingVertical: 12,
              }}
              value={search_query}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              textAlignVertical="center"
            />
          </Box>
        </VStack>

        {has_search_query ? (
          <Text
            color={is_dark ? 'surface.100' : 'surface.700'}
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
          >
            Chats
          </Text>
        ) : null}

        {filtered_chat_summaries.length > 0 ? (
          filtered_chat_summaries.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              on_press={() =>
                navigation.navigate('chat_thread', {
                  chat_id: chat.id,
                  chat_subtitle: chat.subtitle,
                  chat_title: chat.title,
                })
              }
              theme_mode={theme_mode}
            />
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

        {has_search_query ? (
          <VStack space={3}>
            <Text
              color={is_dark ? 'surface.100' : 'surface.700'}
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
            >
              People
            </Text>

            {is_loading_user_search ? (
              <Spinner color="brand.500" size="sm" alignSelf="flex-start" />
            ) : null}

            {user_search_error ? (
              <Box
                rounded="3xl"
                bg={is_dark ? 'panel.100' : 'white'}
                px={5}
                py={5}
                borderWidth={1}
                borderColor={is_dark ? 'panel.50' : 'surface.200'}
              >
                <Text
                  color={is_dark ? 'surface.50' : 'surface.900'}
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  Search failed
                </Text>
                <Text
                  color={is_dark ? 'surface.200' : 'surface.700'}
                  mt={1}
                  fontSize="sm"
                >
                  {user_search_error}
                </Text>
              </Box>
            ) : null}

            {chat_stub_error ? (
              <Text color="brand.500" fontSize="sm">
                {chat_stub_error}
              </Text>
            ) : null}

            {!is_loading_user_search &&
            !user_search_error &&
            user_search_results.length === 0 ? (
              <Box
                rounded="3xl"
                bg={is_dark ? 'panel.100' : 'white'}
                px={5}
                py={5}
                borderWidth={1}
                borderColor={is_dark ? 'panel.50' : 'surface.200'}
              >
                <Text
                  color={is_dark ? 'surface.50' : 'surface.900'}
                  fontSize="md"
                  fontWeight="semibold"
                >
                  No people found
                </Text>
                <Text
                  color={is_dark ? 'surface.200' : 'surface.700'}
                  mt={1}
                  fontSize="sm"
                >
                  Search by username or name on this node.
                </Text>
              </Box>
            ) : null}

            {!is_loading_user_search && !user_search_error
              ? user_search_results.map((user) => (
                  <UserSearchResultItem
                    key={user.public_key}
                    on_press={() =>
                      void handle_select_user(
                        user.public_key,
                        user.name,
                        user.username,
                      )
                    }
                    theme_mode={theme_mode}
                    user={user}
                  />
                ))
              : null}
          </VStack>
        ) : null}
      </VStack>
    </ScrollView>
  );
}
