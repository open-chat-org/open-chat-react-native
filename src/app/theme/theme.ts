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

const input_component_theme = {
  baseStyle: (props: { colorMode?: ThemeMode }) => {
    const is_dark = props.colorMode === 'dark';

    return {
      fontFamily: 'body',
      px: '4',
      py: '3',
      borderRadius: 'full',
      overflow: 'hidden',
      color: is_dark ? 'white' : 'surface.900',
      bg: is_dark ? 'surface.800' : 'surface.50',
      borderWidth: '1',
      borderColor: is_dark ? 'panel.50' : 'surface.200',
      placeholderTextColor: is_dark ? '#8da4b5' : '#6b7f90',
      _input: {
        bg: 'transparent',
        flex: 1,
        h: '100%',
        w: '100%',
      },
      _stack: {
        alignItems: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
      },
      _focus: {
        bg: is_dark ? 'surface.800' : 'surface.50',
        borderColor: 'brand.500',
      },
      _hover: {
        borderColor: is_dark ? 'panel.50' : 'surface.200',
      },
      _invalid: {
        borderColor: 'red.500',
      },
      _disabled: {
        opacity: 0.6,
      },
    };
  },
  defaultProps: {
    rounded: 'full',
    variant: 'outline',
  },
  variants: {
    outline: {},
    unstyled: {
      bg: 'transparent',
      borderWidth: '0',
      px: '0',
      py: '0',
      _focus: {
        bg: 'transparent',
        borderColor: 'transparent',
      },
    },
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
      Input: input_component_theme,
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
      Input: input_component_theme,
    },
  }),
};
