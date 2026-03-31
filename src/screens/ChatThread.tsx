import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Box,
  Center,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, TextInput } from 'react-native';
import { ThemeMode } from '../app/theme/theme';
import { MotionIconButton } from '../components/MotionIconButton';
import { MotionIconSwap } from '../components/MotionIconSwap';
import { ChatMessageBubble } from '../components/ChatMessageBubble';
import { useChatThread } from '../hooks/useChatThread';
import { RootStackParamList } from '../types/navigation.types';

type ChatThreadProps = {
  chat_id?: string;
  chat_subtitle?: string;
  chat_title?: string;
  public_key?: string;
  theme_mode: ThemeMode;
};

export function ChatThread({
  chat_id = '',
  chat_subtitle,
  chat_title,
  public_key,
  theme_mode,
}: ChatThreadProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const is_dark = theme_mode === 'dark';
  const [draft_message, set_draft_message] = useState('');
  const [is_input_focused, set_is_input_focused] = useState(false);
  const header_animation = useRef(new Animated.Value(0)).current;
  const composer_animation = useRef(new Animated.Value(0)).current;
  const {
    chat_messages,
    chat_summary,
    chat_thread_error,
    is_loading_chat_thread,
  } = useChatThread(chat_id);
  const display_title = chat_title ?? chat_summary?.title ?? 'Conversation';
  const display_subtitle =
    chat_subtitle ?? chat_summary?.subtitle ?? 'Private conversation';
  const avatar_label = display_title.replace('@', '').trim().slice(0, 2).toUpperCase();
  const has_draft_message = draft_message.trim().length > 0;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(header_animation, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(composer_animation, {
        duration: 240,
        delay: 50,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [composer_animation, header_animation]);

  if (is_loading_chat_thread) {
    return (
      <Center flex={1} bg={is_dark ? 'surface.900' : 'surface.50'}>
        <Spinner color="brand.500" size="lg" />
      </Center>
    );
  }

  if (chat_thread_error || !chat_summary) {
    return (
      <Center flex={1} px={6} bg={is_dark ? 'surface.900' : 'surface.50'}>
        <VStack
          space={2}
          rounded="3xl"
          bg={is_dark ? 'panel.100' : 'white'}
          px={5}
          py={6}
          borderWidth={1}
          borderColor={is_dark ? 'panel.50' : 'surface.200'}
        >
          <Text
            color={is_dark ? 'surface.50' : 'surface.900'}
            fontSize="lg"
            fontWeight="semibold"
          >
            Conversation unavailable
          </Text>
          <Text color={is_dark ? 'surface.200' : 'surface.700'} fontSize="sm">
            {chat_thread_error || 'This chat could not be found locally.'}
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box flex={1} safeAreaTop bg={is_dark ? 'surface.900' : 'surface.100'}>
      <Animated.View
        style={{
          opacity: header_animation,
          transform: [
            {
              translateY: header_animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-12, 0],
              }),
            },
          ],
        }}
      >
        <Box
          px={4}
          py={3}
          bg={is_dark ? 'brand.800' : 'brand.600'}
        >
          <HStack alignItems="center" justifyContent="space-between" space={3}>
            <HStack alignItems="center" flex={1} space={3}>
              <MotionIconButton
                accessibility_label="Go back"
                bg="rgba(255,255,255,0.14)"
                border_color="rgba(255,255,255,0.12)"
                border_width={1}
                icon_color="#ffffff"
                icon_name="caret-left"
                icon_size={18}
                on_press={() => navigation.goBack()}
                size={40}
              />

              <Box
                h="42px"
                w="42px"
                rounded="full"
                alignItems="center"
                justifyContent="center"
                bg={is_dark ? 'brand.600' : 'brand.500'}
              >
                <Text
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  {avatar_label}
                </Text>
              </Box>

              <VStack flex={1} space={0.5}>
                <Text
                  color="white"
                  fontSize="sm"
                  fontWeight="semibold"
                  numberOfLines={1}
                >
                  {display_title}
                </Text>
                <Text
                  color={is_dark ? 'brand.100' : 'brand.50'}
                  fontSize="xs"
                  numberOfLines={1}
                >
                  {display_subtitle}
                </Text>
              </VStack>
            </HStack>

            <HStack alignItems="center" space={2}>
              <MotionIconButton
                accessibility_label="Voice call"
                bg="rgba(255,255,255,0.14)"
                border_color="rgba(255,255,255,0.12)"
                border_width={1}
                icon_color="#ffffff"
                icon_name="phone"
                icon_size={18}
                on_press={() => undefined}
                size={40}
              />
              <MotionIconButton
                accessibility_label="Video call"
                bg="rgba(255,255,255,0.14)"
                border_color="rgba(255,255,255,0.12)"
                border_width={1}
                icon_color="#ffffff"
                icon_name="video-camera"
                icon_size={18}
                on_press={() => undefined}
                size={40}
              />
            </HStack>
          </HStack>
        </Box>
      </Animated.View>

      <ScrollView
        flex={1}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
        _contentContainerStyle={{
          flexGrow: 1,
          px: 3,
          pb: 3,
          pt: 3,
        }}
      >
        <VStack flex={1} justifyContent={chat_messages.length > 0 ? 'flex-start' : 'center'} space={2}>
          {chat_messages.length > 0 ? (
            chat_messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                is_outgoing={message.sender_public_key === public_key}
                message={message}
                theme_mode={theme_mode}
              />
            ))
          ) : (
            <Center px={8}>
              <Text
                color={is_dark ? 'surface.100' : 'surface.700'}
                fontSize="sm"
                fontWeight="semibold"
                textAlign="center"
              >
                No messages yet
              </Text>
            </Center>
          )}
        </VStack>
      </ScrollView>

      <Animated.View
        style={{
          opacity: composer_animation,
          transform: [
            {
              translateY: composer_animation.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        }}
      >
        <Box
          safeAreaBottom
          px={3}
          pb={3}
          pt={2}
          bg={is_dark ? 'surface.900' : 'surface.100'}
        >
          <HStack alignItems="flex-end" space={2}>
            <Box
              flex={1}
              rounded="3xl"
              bg={is_dark ? 'panel.100' : 'white'}
              px={4}
              py={2}
              borderWidth={1}
              borderColor={
                is_input_focused
                  ? 'brand.500'
                  : is_dark
                    ? 'panel.50'
                    : 'surface.200'
              }
            >
              <Box justifyContent="center" minH="40px">
                <TextInput
                  autoCapitalize="sentences"
                  autoCorrect
                  multiline
                  onBlur={() => set_is_input_focused(false)}
                  onChangeText={set_draft_message}
                  onFocus={() => set_is_input_focused(true)}
                  placeholder="Message"
                  placeholderTextColor={is_dark ? '#8da4b5' : '#6b7f90'}
                  selectionColor={is_dark ? '#d8e3ea' : '#17212b'}
                  style={{
                    color: is_dark ? '#ffffff' : '#17212b',
                    fontSize: 14,
                    maxHeight: 100,
                    paddingVertical: 8,
                    textAlignVertical: 'center',
                  }}
                  value={draft_message}
                />
              </Box>
            </Box>

            <MotionIconButton
              accessibility_label={
                has_draft_message ? 'Send message' : 'Record voice message'
              }
              bg="brand.500"
              icon_color="#ffffff"
              on_press={() => undefined}
              size={52}
            >
              <MotionIconSwap
                active={has_draft_message}
                color="#ffffff"
                from_icon_name="microphone"
                size={20}
                to_icon_name="paper-plane-tilt"
              />
            </MotionIconButton>
          </HStack>
        </Box>
      </Animated.View>
    </Box>
  );
}
