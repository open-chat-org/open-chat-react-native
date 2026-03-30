import { ScrollView } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { IdentityDetailsPage } from '../components/IdentityDetailsPage';
import { useServerStore } from '../store/server.store';

type IdentityDetailsProps = {
  public_key?: string;
  theme_mode: ThemeMode;
};

export function IdentityDetails({
  public_key,
  theme_mode,
}: IdentityDetailsProps) {
  const server_public_key = useServerStore((state) => state.server_public_key);
  const server_public_key_error = useServerStore(
    (state) => state.server_public_key_error,
  );

  return (
    <ScrollView
      flex={1}
      _contentContainerStyle={{
        px: 4,
        pb: 4,
        pt: 2,
      }}
    >
      <IdentityDetailsPage
        public_key={public_key ?? ''}
        server_public_key={server_public_key}
        server_public_key_error={server_public_key_error}
        theme_mode={theme_mode}
      />
    </ScrollView>
  );
}
