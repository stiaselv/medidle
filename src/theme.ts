import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
      '@keyframes bounce': {
        '0%, 100%': {
          transform: 'translateY(0)',
        },
        '50%': {
          transform: 'translateY(-10px)',
        },
      },
      '@keyframes pulse': {
        '0%': {
          opacity: 0.6,
        },
        '50%': {
          opacity: 1,
        },
        '100%': {
          opacity: 0.6,
        },
      },
    },
  },
  colors: {
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
    blue: {
      50: '#EBF8FF',
      100: '#BEE3F8',
      200: '#90CDF4',
      300: '#63B3ED',
      400: '#4299E1',
      500: '#3182CE',
      600: '#2B6CB0',
      700: '#2C5282',
      800: '#2A4365',
      900: '#1A365D',
    },
    green: {
      200: '#9AE6B4', // For success states
      500: '#48BB78', // For primary actions
    },
    red: {
      200: '#FEB2B2', // For error states
      500: '#E53E3E', // For destructive actions
    },
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          transform: 'scale(1.02)',
        },
        _active: {
          transform: 'scale(0.98)',
        },
      },
      variants: {
        solid: {
          bg: 'blue.500',
          color: 'white',
          _hover: {
            bg: 'blue.600',
          },
          _active: {
            bg: 'blue.700',
          },
        },
        ghost: {
          color: 'gray.300',
          _hover: {
            bg: 'whiteAlpha.200',
          },
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: 'gray.700',
        color: 'white',
        px: '2',
        py: '1',
        borderRadius: 'md',
        fontSize: 'sm',
      },
    },
    Spinner: {
      baseStyle: {
        color: 'blue.400',
      },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  semanticTokens: {
    colors: {
      'text-primary': {
        default: 'gray.100',
        _dark: 'gray.100',
      },
      'text-secondary': {
        default: 'gray.300',
        _dark: 'gray.300',
      },
      'text-tertiary': {
        default: 'gray.400',
        _dark: 'gray.400',
      },
      'bg-primary': {
        default: 'gray.900',
        _dark: 'gray.900',
      },
      'bg-secondary': {
        default: 'gray.800',
        _dark: 'gray.800',
      },
      'bg-tertiary': {
        default: 'gray.700',
        _dark: 'gray.700',
      },
      'border-color': {
        default: 'gray.600',
        _dark: 'gray.600',
      },
      'action-primary': {
        default: 'blue.500',
        _dark: 'blue.500',
      },
      'action-secondary': {
        default: 'gray.600',
        _dark: 'gray.600',
      },
    },
  },
});

export { theme }; 