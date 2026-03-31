import { Box, Button, FormControl, Spinner, Text, VStack } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { ThemeMode } from '../app/theme/theme';
import { useUserProfileStore } from '../store/user-profile.store';
import { SaveUserProfilePayload } from '../types/user.types';

type ProfileSettingsFormProps = {
  public_key: string;
  theme_mode: ThemeMode;
};

type ProfileTextFieldProps = {
  auto_capitalize?: 'none' | 'sentences' | 'words' | 'characters';
  is_dark: boolean;
  is_focused: boolean;
  keyboard_type?: 'default' | 'email-address' | 'phone-pad';
  label: string;
  multiline?: boolean;
  on_blur: () => void;
  on_change: (value: string) => void;
  on_focus: () => void;
  placeholder: string;
  value: string;
};

function ProfileTextField({
  auto_capitalize = 'sentences',
  is_dark,
  is_focused,
  keyboard_type = 'default',
  label,
  multiline = false,
  on_blur,
  on_change,
  on_focus,
  placeholder,
  value,
}: ProfileTextFieldProps) {
  return (
    <FormControl>
      <FormControl.Label
        _text={{ color: is_dark ? 'surface.100' : 'surface.700' }}
      >
        {label}
      </FormControl.Label>
      <Box
        rounded={multiline ? '3xl' : 'full'}
        bg={is_dark ? 'surface.800' : 'surface.50'}
        borderWidth={1}
        borderColor={is_focused ? 'brand.500' : is_dark ? 'panel.50' : 'surface.200'}
        px={4}
        py={multiline ? 3 : 0}
        minH={multiline ? '96px' : '50px'}
        justifyContent="center"
      >
        <TextInput
          autoCapitalize={auto_capitalize}
          keyboardType={keyboard_type}
          multiline={multiline}
          onBlur={on_blur}
          onChangeText={on_change}
          onFocus={on_focus}
          placeholder={placeholder}
          placeholderTextColor={is_dark ? '#8da4b5' : '#6b7f90'}
          selectionColor={is_dark ? '#d8e3ea' : '#17212b'}
          style={{
            color: is_dark ? '#ffffff' : '#17212b',
            fontSize: 14,
            minHeight: multiline ? 72 : undefined,
            paddingVertical: multiline ? 0 : 12,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
          value={value}
        />
      </Box>
    </FormControl>
  );
}

export function ProfileSettingsForm({
  public_key,
  theme_mode,
}: ProfileSettingsFormProps) {
  const is_dark = theme_mode === 'dark';
  const [active_field, set_active_field] =
    useState<keyof SaveUserProfilePayload | null>(null);
  const [has_initialized_form, set_has_initialized_form] = useState(false);
  const synced_profile_public_key_ref = useRef('');
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
    synced_profile_public_key_ref.current = '';
    set_has_initialized_form(false);
    set_form_state({
      email: '',
      name: '',
      phone: '',
      quote: '',
      username: '',
    });

    if (public_key) {
      void fetch_user_profile();
      return;
    }

    set_has_initialized_form(true);
  }, [fetch_user_profile, public_key]);

  useEffect(() => {
    if (!user_profile || user_profile.public_key !== public_key) {
      return;
    }

    if (synced_profile_public_key_ref.current === user_profile.public_key) {
      set_has_initialized_form(true);
      return;
    }

    set_form_state({
      email: user_profile.email ?? '',
      name: user_profile.name ?? '',
      phone: user_profile.phone ?? '',
      quote: user_profile.quote ?? '',
      username: user_profile.username ?? '',
    });
    synced_profile_public_key_ref.current = user_profile.public_key;
    set_has_initialized_form(true);
  }, [public_key, user_profile]);

  useEffect(() => {
    if (!is_loading_user_profile && user_profile_error) {
      set_has_initialized_form(true);
    }
  }, [is_loading_user_profile, user_profile_error]);

  const handle_change = (
    field: keyof SaveUserProfilePayload,
    value: string,
  ) => {
    if (user_profile_error || user_profile_success_message) {
      reset_user_profile_feedback();
    }

    set_form_state((current_state) => ({
      ...current_state,
      [field]: value,
    }));
  };

  const handle_save_profile = async () => {
    const saved_profile = await save_user_profile({
      username: form_state.username,
      name: form_state.name,
      quote: form_state.quote,
      phone: form_state.phone,
      email: form_state.email,
    });

    if (saved_profile) {
      synced_profile_public_key_ref.current = saved_profile.public_key;
    }
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

        {is_loading_user_profile && !has_initialized_form ? (
          <Spinner color="brand.500" size="sm" alignSelf="flex-start" />
        ) : null}

        {!has_initialized_form ? null : (
          <>
            <ProfileTextField
              is_dark={is_dark}
              is_focused={active_field === 'username'}
              label="Username"
              on_blur={() => set_active_field((current_field) =>
                current_field === 'username' ? null : current_field,
              )}
              value={form_state.username}
              on_change={(value) => handle_change('username', value)}
              on_focus={() => set_active_field('username')}
              placeholder="your_username"
            />

            <ProfileTextField
              is_dark={is_dark}
              is_focused={active_field === 'name'}
              label="Name"
              on_blur={() => set_active_field((current_field) =>
                current_field === 'name' ? null : current_field,
              )}
              value={form_state.name}
              on_change={(value) => handle_change('name', value)}
              on_focus={() => set_active_field('name')}
              placeholder="Your display name"
            />

            <ProfileTextField
              is_dark={is_dark}
              is_focused={active_field === 'quote'}
              label="Quote"
              multiline
              on_blur={() => set_active_field((current_field) =>
                current_field === 'quote' ? null : current_field,
              )}
              value={form_state.quote}
              on_change={(value) => handle_change('quote', value)}
              on_focus={() => set_active_field('quote')}
              placeholder="A short status or quote"
            />

            <ProfileTextField
              is_dark={is_dark}
              is_focused={active_field === 'phone'}
              keyboard_type="phone-pad"
              label="Phone"
              on_blur={() => set_active_field((current_field) =>
                current_field === 'phone' ? null : current_field,
              )}
              value={form_state.phone}
              on_change={(value) => handle_change('phone', value)}
              on_focus={() => set_active_field('phone')}
              placeholder="+91 98765 43210"
            />

            <ProfileTextField
              auto_capitalize="none"
              is_dark={is_dark}
              is_focused={active_field === 'email'}
              keyboard_type="email-address"
              label="Email"
              on_blur={() => set_active_field((current_field) =>
                current_field === 'email' ? null : current_field,
              )}
              value={form_state.email}
              on_change={(value) => handle_change('email', value)}
              on_focus={() => set_active_field('email')}
              placeholder="you@example.com"
            />

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
          </>
        )}
      </VStack>
    </Box>
  );
}
