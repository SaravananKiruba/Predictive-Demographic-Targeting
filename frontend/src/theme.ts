import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#bae3ff',
      200: '#8dcfff',
      300: '#5fbaff',
      400: '#36a9ff',
      500: '#1c8fff',
      600: '#0072e6',
      700: '#0059b3',
      800: '#004080',
      900: '#00254d',
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        primary: {
          bg: 'brand.600',
          color: 'white',
          _hover: {
            bg: 'brand.700',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        p: '20px',
        borderRadius: 'lg',
        boxShadow: 'md',
        bg: 'white',
      },
    },
  },
});

export default theme;
