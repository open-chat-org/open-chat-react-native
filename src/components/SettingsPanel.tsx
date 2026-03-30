import { Heading, Text, VStack } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { SettingsMenuItem } from './SettingsMenuItem';

type SettingsPanelProps = {
  on_open_details: () => void;
  on_open_profile: () => void;
  theme_mode: ThemeMode;
};

export function SettingsPanel({
  on_open_details,
  on_open_profile,
  theme_mode,
}: SettingsPanelProps) {
  const is_dark = theme_mode === 'dark';

  return (
    <VStack space={4}>
      <VStack space={1}>
        <Text color="brand.500" fontSize="xs" fontWeight="bold" textTransform="uppercase">
          Preferences
        </Text>
        <Heading color={is_dark ? 'white' : 'surface.900'} size="md">
          Privacy and identity
        </Heading>
        <Text color={is_dark ? 'surface.100' : 'surface.700'} fontSize="sm">
          Manage the profile details people can see and the identity keys that define you.
        </Text>
      </VStack>

      <VStack space={5}>
        <VStack space={2}>
          <Text
            color={is_dark ? 'surface.100' : 'surface.700'}
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
          >
            Profile
          </Text>
          <SettingsMenuItem
            description="Edit username, name, quote, phone, and email."
            on_press={on_open_profile}
            theme_mode={theme_mode}
            title="Profile Details"
          />
        </VStack>

        <VStack space={2}>
          <Text
            color={is_dark ? 'surface.100' : 'surface.700'}
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
          >
            Identity
          </Text>
          <SettingsMenuItem
            description="View your public key, scan its QR code, and download your private key."
            on_press={on_open_details}
            theme_mode={theme_mode}
            title="Details"
          />
        </VStack>
      </VStack>
    </VStack>
  );
}
