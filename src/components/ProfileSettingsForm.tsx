import { Box, Button, FormControl, Input, Spinner, Text, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { ThemeMode } from '../app/theme/theme';
import { useUserProfileStore } from '../store/user-profile.store';
import { SaveUserProfilePayload } from '../types/user.types';

type ProfileSettingsFormProps = {
  public_key: string;
  theme_mode: ThemeMode;
};

export function ProfileSettingsForm({
  public_key,
  theme_mode,
}: ProfileSettingsFormProps) {
  const is_dark = theme_mode === 'dark';
  const [form_state, set_form_state] = useState({
    email: '',
    name: '',
    phone: '',
    quote: '',
    username: '',
  });
  const fetch_user_profile = useUserProfileStore(
    (state) => state.fetch_user_profile,
  );
  const is_loading_user_profile = useUserProfileStore(
    (state) => state.is_loading_user_profile,
  );
  const is_saving_user_profile = useUserProfileStore(
    (state) => state.is_saving_user_profile,
  );
  const reset_user_profile_feedback = useUserProfileStore(
    (state) => state.reset_user_profile_feedback,
  );
  const save_user_profile = useUserProfileStore(
    (state) => state.save_user_profile,
  );
  const user_profile = useUserProfileStore((state) => state.user_profile);
  const user_profile_error = useUserProfileStore(
    (state) => state.user_profile_error,
  );
  const user_profile_success_message = useUserProfileStore(
    (state) => state.user_profile_success_message,
  );

  useEffect(() => {
    if (public_key) {
      void fetch_user_profile();
    }
  }, [fetch_user_profile, public_key]);

  useEffect(() => {
    if (!user_profile || user_profile.public_key !== public_key) {
      return;
    }

    set_form_state({
      email: user_profile.email ?? '',
      name: user_profile.name ?? '',
      phone: user_profile.phone ?? '',
      quote: user_profile.quote ?? '',
      username: user_profile.username ?? '',
    });
  }, [public_key, user_profile]);

  const handle_change = (
    field: keyof SaveUserProfilePayload,
    value: string,
  ) => {
    reset_user_profile_feedback();
    set_form_state((current_state) => ({
      ...current_state,
      [field]: value,
    }));
  };

  const handle_save_profile = async () => {
    await save_user_profile({
      username: form_state.username,
      name: form_state.name,
      quote: form_state.quote,
      phone: form_state.phone,
      email: form_state.email,
    });
  };

  return (
    <Box
      rounded="3xl"
      bg={is_dark ? 'panel.50' : 'white'}
      px={5}
      py={5}
      borderWidth={1}
      borderColor={is_dark ? 'panel.50' : 'surface.200'}
    >
      <VStack space={4}>
        <VStack space={1}>
          <Text color={is_dark ? 'surface.100' : 'surface.700'} fontSize="xs" textTransform="uppercase">
            Profile
          </Text>
          <Text color={is_dark ? 'surface.50' : 'surface.900'} fontSize="sm">
            Update the details other people will see when they discover your public key.
          </Text>
        </VStack>

        {is_loading_user_profile ? (
          <Spinner color="brand.500" size="sm" alignSelf="flex-start" />
        ) : null}

        <FormControl>
          <FormControl.Label _text={{ color: is_dark ? 'surface.100' : 'surface.700' }}>
            Username
          </FormControl.Label>
          <Input
            value={form_state.username}
            onChangeText={(value) => handle_change('username', value)}
            bg={is_dark ? 'surface.800' : 'surface.50'}
            color={is_dark ? 'white' : 'surface.900'}
            placeholder="your_username"
            placeholderTextColor={is_dark ? '#8da4b5' : '#6b7f90'}
            _focus={{ bg: is_dark ? 'surface.800' : 'surface.50' }}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label _text={{ color: is_dark ? 'surface.100' : 'surface.700' }}>
            Name
          </FormControl.Label>
          <Input
            value={form_state.name}
            onChangeText={(value) => handle_change('name', value)}
            bg={is_dark ? 'surface.800' : 'surface.50'}
            color={is_dark ? 'white' : 'surface.900'}
            placeholder="Your display name"
            placeholderTextColor={is_dark ? '#8da4b5' : '#6b7f90'}
            _focus={{ bg: is_dark ? 'surface.800' : 'surface.50' }}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label _text={{ color: is_dark ? 'surface.100' : 'surface.700' }}>
            Quote
          </FormControl.Label>
          <Input
            value={form_state.quote}
            onChangeText={(value) => handle_change('quote', value)}
            bg={is_dark ? 'surface.800' : 'surface.50'}
            color={is_dark ? 'white' : 'surface.900'}
            placeholder="A short status or quote"
            placeholderTextColor={is_dark ? '#8da4b5' : '#6b7f90'}
            multiline
            numberOfLines={4}
            h="96px"
            textAlignVertical="top"
            _focus={{ bg: is_dark ? 'surface.800' : 'surface.50' }}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label _text={{ color: is_dark ? 'surface.100' : 'surface.700' }}>
            Phone
          </FormControl.Label>
          <Input
            value={form_state.phone}
            onChangeText={(value) => handle_change('phone', value)}
            bg={is_dark ? 'surface.800' : 'surface.50'}
            color={is_dark ? 'white' : 'surface.900'}
            placeholder="+91 98765 43210"
            placeholderTextColor={is_dark ? '#8da4b5' : '#6b7f90'}
            keyboardType="phone-pad"
            _focus={{ bg: is_dark ? 'surface.800' : 'surface.50' }}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label _text={{ color: is_dark ? 'surface.100' : 'surface.700' }}>
            Email
          </FormControl.Label>
          <Input
            value={form_state.email}
            onChangeText={(value) => handle_change('email', value)}
            bg={is_dark ? 'surface.800' : 'surface.50'}
            color={is_dark ? 'white' : 'surface.900'}
            placeholder="you@example.com"
            placeholderTextColor={is_dark ? '#8da4b5' : '#6b7f90'}
            keyboardType="email-address"
            autoCapitalize="none"
            _focus={{ bg: is_dark ? 'surface.800' : 'surface.50' }}
          />
        </FormControl>

        <Button
          bg="brand.500"
          _pressed={{ bg: 'brand.600' }}
          onPress={() => void handle_save_profile()}
          isLoading={is_saving_user_profile}
          isLoadingText="Saving profile"
        >
          Save Profile
        </Button>

        {user_profile_success_message ? (
          <Text color="brand.500" fontSize="sm" fontWeight="medium">
            {user_profile_success_message}
          </Text>
        ) : null}

        {user_profile_error ? (
          <Text color="red.400" fontSize="sm">
            {user_profile_error}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
}
