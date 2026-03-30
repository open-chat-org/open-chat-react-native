import { extendTheme } from 'native-base';

export type ThemeMode = 'light' | 'dark';

const shared_colors = {
  brand: {
    50: '#edfdf7',
    100: '#d2f8ea',
    200: '#a9efd5',
    300: '#73dfbb',
    400: '#36c99a',
    500: '#13ae80',
    600: '#0f8c67',
    700: '#0d6d52',
    800: '#0d5642',
    900: '#0a4738',
  },
  accent: {
    50: '#fff6ed',
    100: '#ffe7d1',
    200: '#ffcca3',
    300: '#ffab6b',
    400: '#ff8633',
    500: '#fb6714',
    600: '#ec4c0a',
    700: '#c3350b',
    800: '#9b2b11',
    900: '#7d2612',
  },
};

export const app_themes = {
  light: extendTheme({
    radii: {
      xl: 22,
      '2xl': 28,
      '3xl': 36,
    },
    colors: {
      ...shared_colors,
      surface: {
        50: '#f7fafc',
        100: '#eef4f7',
        200: '#dde7ed',
        300: '#c8d5de',
        700: '#314253',
        800: '#243443',
        900: '#17212b',
      },
      panel: {
        50: '#ffffff',
        100: '#f5f8fb',
        200: '#ebf0f5',
      },
    },
    components: {
      Button: {
        defaultProps: {
          rounded: 'full',
        },
      },
      Input: {
        defaultProps: {
          rounded: 'full',
          borderWidth: 0,
        },
      },
    },
  }),
  dark: extendTheme({
    radii: {
      xl: 22,
      '2xl': 28,
      '3xl': 36,
    },
    colors: {
      ...shared_colors,
      surface: {
        50: '#d8e3ea',
        100: '#b9cad8',
        200: '#8da4b5',
        300: '#678195',
        700: '#13212d',
        800: '#0d1822',
        900: '#081019',
      },
      panel: {
        50: '#162230',
        100: '#101b27',
        200: '#0d1520',
      },
    },
    components: {
      Button: {
        defaultProps: {
          rounded: 'full',
        },
      },
      Input: {
        defaultProps: {
          rounded: 'full',
          borderWidth: 0,
        },
      },
    },
  }),
};
