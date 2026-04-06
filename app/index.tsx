import { useCallback, useEffect, useRef, useState } from 'react';

import { CompanionSelectionScreen } from '@/components/features/companion-selection/companion-selection-screen';
import { SplashScreen } from '@/components/features/splash/splash-screen';

const SPLASH_FALLBACK_MS = 8000;

export default function IndexScreen() {
  const [hasSplashFinished, setHasSplashFinished] = useState(false);
  const hasFinishedRef = useRef(false);

  const finishSplash = useCallback(() => {
    if (hasFinishedRef.current) {
      return;
    }

    hasFinishedRef.current = true;
    setHasSplashFinished(true);
  }, []);

  useEffect(() => {
    const fallbackTimer = setTimeout(finishSplash, SPLASH_FALLBACK_MS);

    return () => clearTimeout(fallbackTimer);
  }, [finishSplash]);

  if (!hasSplashFinished) {
    return <SplashScreen onComplete={finishSplash} />;
  }

  return <CompanionSelectionScreen />;
}
