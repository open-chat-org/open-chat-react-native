import 'react-native-get-random-values';
import { NativeBaseProvider } from 'native-base';
import { useColorScheme } from 'react-native';
import { AppRouter } from './src/app/router/AppRouter';
import { app_themes, ThemeMode } from './src/app/theme/theme';

export default function App() {
  const system_color_scheme = useColorScheme();
  const theme_mode: ThemeMode =
    system_color_scheme === 'light' ? 'light' : 'dark';

  return (
    <NativeBaseProvider theme={app_themes[theme_mode]}>
      <AppRouter theme_mode={theme_mode} />
    </NativeBaseProvider>
  );
}
