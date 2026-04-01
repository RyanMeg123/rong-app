import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#F5A43A',
    primarySoft: '#FFDDA3',
    bg: '#F8F3E8',
    bgCard: '#FFF8EE',
    textMain: '#5D4636',
    textSub: '#8B7764',
    line: '#6F5847',
    leaf: '#A8D98D',
    sky: '#A9D9F0',
    petal: '#F3C7D7',
    warn: '#E9917C',
    white: '#FFFFFF',
    shadow: '#A67736',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  radius: {
    sm: 12,
    md: 20,
    lg: 28,
    full: 9999,
  },
  typography: {
    headingXL: {
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '700' as const,
    },
    headingLG: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '700' as const,
    },
    headingMD: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as const,
    },
    bodyLG: {
      fontSize: 17,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    bodyMD: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400' as const,
    },
  },
  shadow: {
    card: Platform.select({
      web: {
        boxShadow: '0px 6px 12px rgba(139, 95, 44, 0.12)',
      },
      default: {
        shadowColor: '#8B5F2C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
} as const;
