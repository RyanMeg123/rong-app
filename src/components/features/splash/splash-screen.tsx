import { DotLottie } from '@lottiefiles/dotlottie-react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';

import { styles } from './splash-screen.styles';

import openScreenLottie from '../../../../assets/lottie/openscreen.lottie';

const OPEN_SCREEN_WIDTH = 1176;
const OPEN_SCREEN_HEIGHT = 1764;

type SplashScreenProps = {
  onComplete?: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const animationAspectRatio = OPEN_SCREEN_WIDTH / OPEN_SCREEN_HEIGHT;
  const animationWidth = Math.max(screenWidth, screenHeight * animationAspectRatio);
  const animationHeight = Math.max(screenHeight, screenWidth / animationAspectRatio);
  const animationStyle = StyleSheet.flatten<ViewStyle>([
    styles.animation,
    {
      width: animationWidth,
      height: animationHeight,
    },
  ]);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.backdrop} />
      <DotLottie
        autoplay
        loop={false}
        onComplete={onComplete}
        onLoadError={onComplete}
        source={openScreenLottie}
        style={animationStyle}
      />
    </View>
  );
}
