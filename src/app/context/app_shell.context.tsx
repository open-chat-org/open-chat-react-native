import { createContext, ReactNode, useContext } from 'react';
import { ThemeMode } from '../theme/theme';

type AppShellContextValue = {
  public_key: string;
  refresh_session: () => Promise<void>;
  theme_mode: ThemeMode;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

type AppShellProviderProps = {
  children: ReactNode;
  value: AppShellContextValue;
};

export function AppShellProvider({
  children,
  value,
}: AppShellProviderProps) {
  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const context = useContext(AppShellContext);

  if (!context) {
    throw new Error('useAppShell must be used inside AppShellProvider.');
  }

  return context;
}
