import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Box, Button, HStack, Text, VStack } from 'native-base';
import { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { ThemeMode } from '../app/theme/theme';
import { get_ed25519_private_key } from '../shared/services/storage/private-key.storage';
import { truncate_hex } from '../shared/utils/hex';
import { AppIcon } from './AppIcon';

type IdentityDetailsPageProps = {
  public_key: string;
  server_public_key: string;
  server_public_key_error: string;
  theme_mode: ThemeMode;
};

export function IdentityDetailsPage({
  public_key,
  server_public_key,
  server_public_key_error,
  theme_mode,
}: IdentityDetailsPageProps) {
  const is_dark = theme_mode === 'dark';
  const [copy_message, set_copy_message] = useState('');
  const [export_message, set_export_message] = useState('');
  const [export_error, set_export_error] = useState('');
  const [is_exporting_private_key, set_is_exporting_private_key] = useState(false);

  const handle_copy_public_key = async () => {
    await Clipboard.setStringAsync(public_key);
    set_copy_message('Public key copied.');
  };

  const handle_export_private_key = async () => {
    try {
      set_is_exporting_private_key(true);
      set_export_error('');
      set_export_message('');

      const private_key = await get_ed25519_private_key();

      if (!private_key) {
        throw new Error('Ed25519 private key is not available on this device.');
      }

      const can_share = await Sharing.isAvailableAsync();

      if (!can_share || !FileSystem.documentDirectory) {
        throw new Error('Secure private key export is not available on this device.');
      }

      const export_file_uri = `${FileSystem.documentDirectory}open-chat-private-key.txt`;

      await FileSystem.writeAsStringAsync(
        export_file_uri,
        `Open Chat Private Key\n${private_key}\n`,
      );
      await Sharing.shareAsync(export_file_uri, {
        dialogTitle: 'Export private key',
      });

      set_export_message('Private key export opened.');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to export the private key.';

      set_export_error(message);
    } finally {
      set_is_exporting_private_key(false);
    }
  };

  return (
    <VStack space={4}>
      <Box
        rounded="3xl"
        bg={is_dark ? 'panel.50' : 'white'}
        px={5}
        py={5}
        borderWidth={1}
        borderColor={is_dark ? 'panel.50' : 'surface.200'}
      >
        <VStack space={5}>
          <VStack space={1}>
            <Text
              color={is_dark ? 'surface.100' : 'surface.700'}
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Public identity
            </Text>
            <Text color={is_dark ? 'surface.50' : 'surface.900'} fontSize="sm">
              Share this key so other people can encrypt messages for you.
            </Text>
          </VStack>

          <Box
            rounded="2xl"
            bg={is_dark ? 'panel.100' : 'surface.50'}
            px={4}
            py={4}
          >
            <Text
              color={is_dark ? 'white' : 'surface.900'}
              fontSize="sm"
              fontWeight="medium"
              lineHeight="24px"
            >
              {public_key}
            </Text>
          </Box>

          <HStack space={3}>
            <Button
              flex={1}
              bg="brand.500"
              _pressed={{ bg: 'brand.600' }}
              onPress={() => void handle_copy_public_key()}
            >
              <HStack alignItems="center" space={2}>
                <AppIcon color="#ffffff" name="copy" size={18} weight="regular" />
                <Text color="white" fontSize="sm" fontWeight="semibold">
                  Copy Public Key
                </Text>
              </HStack>
            </Button>
            <Button
              flex={1}
              variant="outline"
              borderColor="brand.500"
              onPress={() => void handle_export_private_key()}
              isLoading={is_exporting_private_key}
              isLoadingText="Exporting"
            >
              <HStack alignItems="center" space={2}>
                <AppIcon
                  color="#13ae80"
                  name="download-simple"
                  size={18}
                  weight="regular"
                />
                <Text color="brand.500" fontSize="sm" fontWeight="semibold">
                  Download Private Key
                </Text>
              </HStack>
            </Button>
          </HStack>

          {copy_message ? (
            <Text color="brand.500" fontSize="sm" fontWeight="medium">
              {copy_message}
            </Text>
          ) : null}

          {export_message ? (
            <Text color="brand.500" fontSize="sm" fontWeight="medium">
              {export_message}
            </Text>
          ) : null}

          {export_error ? (
            <Text color="red.400" fontSize="sm">
              {export_error}
            </Text>
          ) : null}
        </VStack>
      </Box>

      <Box
        rounded="3xl"
        bg={is_dark ? 'panel.50' : 'white'}
        px={5}
        py={5}
        borderWidth={1}
        borderColor={is_dark ? 'panel.50' : 'surface.200'}
      >
        <VStack space={4} alignItems="center">
          <VStack alignSelf="stretch" space={1}>
            <Text
              color={is_dark ? 'surface.100' : 'surface.700'}
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
            >
              QR code
            </Text>
            <Text color={is_dark ? 'surface.50' : 'surface.900'} fontSize="sm">
              Scanning this QR code returns your public key.
            </Text>
          </VStack>

          <Box rounded="3xl" bg="white" p={4}>
            <QRCode
              value={public_key}
              size={180}
              color="#081019"
              backgroundColor="white"
            />
          </Box>
        </VStack>
      </Box>

      <Box
        rounded="3xl"
        bg={is_dark ? 'panel.50' : 'white'}
        px={5}
        py={5}
        borderWidth={1}
        borderColor={is_dark ? 'panel.50' : 'surface.200'}
      >
        <VStack space={3}>
          <Text
            color={is_dark ? 'surface.100' : 'surface.700'}
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
          >
            Server identity
          </Text>
          {server_public_key ? (
            <VStack space={2}>
              <Text color={is_dark ? 'surface.50' : 'surface.900'} fontSize="sm">
                Connected node public key
              </Text>
              <Text color={is_dark ? 'white' : 'surface.900'} fontSize="sm" fontWeight="medium">
                {truncate_hex(server_public_key, 24)}
              </Text>
            </VStack>
          ) : server_public_key_error ? (
            <Text color="red.400" fontSize="sm">
              {server_public_key_error}
            </Text>
          ) : (
            <Text color={is_dark ? 'surface.50' : 'surface.900'} fontSize="sm">
              Server key is not available yet.
            </Text>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
