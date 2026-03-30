import { Center } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { AccountActionCard } from '../components/AccountActionCard';
import { useCreateAccount } from '../hooks/useCreateAccount';

type CreateAccountProps = {
  on_account_created?: () => Promise<void>;
  theme_mode: ThemeMode;
};

export function CreateAccount({
  on_account_created,
  theme_mode,
}: CreateAccountProps) {
  const {
    create_account,
    created_public_key,
    error_message,
    is_creating_account,
  } = useCreateAccount();

  const handle_create_account = async () => {
    const result = await create_account();

    if (result && on_account_created) {
      await on_account_created();
    }
  };

  return (
    <Center flex={1} bg={theme_mode === 'dark' ? 'surface.900' : 'surface.50'} px={6}>
      <AccountActionCard
        created_public_key={created_public_key}
        error_message={error_message}
        is_creating_account={is_creating_account}
        on_create_account={handle_create_account}
        theme_mode={theme_mode}
      />
    </Center>
  );
}
