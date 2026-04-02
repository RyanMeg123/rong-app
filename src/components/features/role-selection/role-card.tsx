import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { RoleCardData } from '@/types/api';

interface RoleCardProps {
  role: RoleCardData;
  selected: boolean;
  onPress: () => void;
}

function RoleMedia({ role }: Pick<RoleCardProps, 'role'>) {
  const mediaSource = role.video;
  const [isVideoReady, setIsVideoReady] = useState(false);

  const player = useVideoPlayer(mediaSource ?? null, (videoPlayer) => {
    if (!mediaSource) {
      return;
    }

    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  useEffect(() => {
    setIsVideoReady(false);
  }, [mediaSource]);

  if (mediaSource) {
    return (
      <View style={styles.mediaLayer}>
        <Image contentFit="cover" source={role.image} style={[styles.image, isVideoReady && styles.hiddenCover]} />
        <VideoView
          contentFit="cover"
          nativeControls={false}
          onFirstFrameRender={() => setIsVideoReady(true)}
          player={player}
          style={styles.video}
        />
      </View>
    );
  }

  return <Image contentFit="cover" source={role.image} style={styles.image} />;
}

export function RoleCard({ role, selected, onPress }: RoleCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.selectedCard, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <RoleMedia role={role} />
      </View>
      <Text style={styles.name}>{role.name}</Text>
      <Text style={styles.description}>
        {role.title}，
        <Text style={styles.description}>{role.description}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    minHeight: 186,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#BFA98F',
    backgroundColor: '#FFF5E8',
    alignItems: 'center',
    ...theme.shadow.card,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2.5,
    shadowOpacity: 0.18,
    transform: [{ translateY: -2 }],
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    width: 98,
    height: 98,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  mediaLayer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hiddenCover: {
    opacity: 0,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  name: {
    color: theme.colors.textMain,
    textAlign: 'center',
    marginBottom: 6,
    ...theme.typography.headingMD,
  },
  description: {
    color: theme.colors.textSub,
    textAlign: 'center',
    ...theme.typography.caption,
  },
});
