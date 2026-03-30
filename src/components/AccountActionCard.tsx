import { Button, Heading, Text, VStack } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { truncate_hex } from '../shared/utils/hex';

type AccountActionCardProps = {
  created_public_key: string;
  error_message: string;
  is_creating_account: boolean;
  on_create_account: () => Promise<void>;
  theme_mode: ThemeMode;
};

export function AccountActionCard({
  created_public_key,
  error_message,
  is_creating_account,
  on_create_account,
  theme_mode,
}: AccountActionCardProps) {
  const is_dark = theme_mode === 'dark';

  return (
    <VStack w="100%" maxW="440px" space={6}>
      <VStack space={3}>
        <Text color="brand.500" fontSize="sm" fontWeight="bold" textTransform="uppercase">
          Open Chat
        </Text>
        <Heading color={is_dark ? 'white' : 'surface.900'} size="xl">
          Create or import your account
        </Heading>
        <Text color={is_dark ? 'surface.100' : 'surface.800'} fontSize="md">
          A scalable account flow where key generation, storage, and backend sync are
          separated into services.
        </Text>
      </VStack>

      <VStack space={3}>
        <Button
          size="lg"
          bg="brand.500"
          _pressed={{ bg: 'brand.700' }}
          onPress={() => void on_create_account()}
          isLoading={is_creating_account}
          isLoadingText="Creating account"
        >
          Create Account
        </Button>
        <Button
          size="lg"
          variant="outline"
          borderColor="brand.500"
          _text={{ color: 'brand.500' }}
          _pressed={{ bg: is_dark ? 'surface.900' : 'surface.100' }}
        >
          Import Account
        </Button>
      </VStack>

      {created_public_key ? (
        <Text color="brand.500" fontSize="sm" fontWeight="medium">
          Public key: {truncate_hex(created_public_key)}
        </Text>
      ) : null}
      {error_message ? (
        <Text color="red.400" fontSize="sm">
          {error_message}
        </Text>
      ) : null}
    </VStack>
  );
}
