import { Platform } from 'react-native';

const appFontFamily = 'LemiBoBoTi';

export const theme = {
  fonts: {
    primary: appFontFamily,
    accent: 'BubblegumSans',
    body: Platform.select({
      ios: 'PingFang SC',
      android: 'sans-serif',
      default: 'System',
    }),
  },
  colors: {
    primary: '#FF8E8B',
    primarySoft: '#FFD7C6',
    bg: '#FFF8F4',
    bgCard: '#FFFFFF',
    textMain: '#4C352F',
    textSub: '#8C756F',
    line: '#EAD7CF',
    lineStrong: '#B4584F',
    leaf: '#8EE0BD',
    sky: '#9FBEFF',
    petal: '#FAD8BF',
    warn: '#E9917C',
    cream: '#FFF5D6',
    mint: '#D8F1E9',
    panel: '#F9F3EE',
    white: '#FFFFFF',
    shadow: '#D7B6AA',
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
      fontFamily: appFontFamily,
      fontSize: 30,
      lineHeight: 36,
    },
    headingLG: {
      fontFamily: appFontFamily,
      fontSize: 24,
      lineHeight: 30,
    },
    headingMD: {
      fontFamily: appFontFamily,
      fontSize: 18,
      lineHeight: 24,
    },
    bodyLG: {
      fontFamily: appFontFamily,
      fontSize: 17,
      lineHeight: 24,
    },
    bodyMD: {
      fontFamily: appFontFamily,
      fontSize: 15,
      lineHeight: 22,
    },
    caption: {
      fontFamily: appFontFamily,
      fontSize: 13,
      lineHeight: 18,
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
