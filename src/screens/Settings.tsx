import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { SettingsPanel } from '../components/SettingsPanel';
import { RootStackParamList } from '../types/navigation.types';

type SettingsProps = {
  theme_mode: ThemeMode;
};

export function Settings({ theme_mode }: SettingsProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView
      flex={1}
      _contentContainerStyle={{
        px: 4,
        pb: 4,
        pt: 2,
      }}
    >
      <SettingsPanel
        on_open_details={() => navigation.navigate('identity_details')}
        on_open_profile={() => navigation.navigate('profile_settings')}
        theme_mode={theme_mode}
      />
    </ScrollView>
  );
}
