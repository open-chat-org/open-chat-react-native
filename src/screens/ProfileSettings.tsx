import { ScrollView } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { ProfileSettingsForm } from '../components/ProfileSettingsForm';

type ProfileSettingsProps = {
  public_key?: string;
  theme_mode: ThemeMode;
};

export function ProfileSettings({
  public_key,
  theme_mode,
}: ProfileSettingsProps) {
  return (
    <ScrollView
      flex={1}
      _contentContainerStyle={{
        px: 4,
        pb: 4,
        pt: 2,
      }}
    >
      <ProfileSettingsForm public_key={public_key ?? ''} theme_mode={theme_mode} />
    </ScrollView>
  );
}
