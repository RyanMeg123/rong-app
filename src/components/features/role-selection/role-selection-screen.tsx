import { useEffect, useMemo, useRef, useState } from 'react';
import { useEventListener } from 'expo';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { AppScreen } from '@/components/ui/app-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ErrorView, LoadingView } from '@/components/ui/status-view';
import { useRoles } from '@/hooks/use-roles';
import { useAppState } from '@/providers/app-state-provider';
import type { RoleCardData } from '@/types/api';

import { RoleCard } from './role-card';

function SelectionShowcase({
  role,
  onFinished,
}: {
  role: RoleCardData;
  onFinished: () => void;
}) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const hasFinishedRef = useRef(false);

  const player = useVideoPlayer(role.selectedVideo ?? null, (videoPlayer) => {
    if (!role.selectedVideo) {
      return;
    }

    videoPlayer.loop = false;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  useEffect(() => {
    setIsVideoReady(false);
    hasFinishedRef.current = false;
  }, [role.id]);

  useEventListener(player, 'playToEnd', () => {
    if (hasFinishedRef.current) {
      return;
    }

    hasFinishedRef.current = true;
    onFinished();
  });

  return (
    <View style={styles.showcaseOverlay}>
      <View style={styles.showcaseBackdrop} />
      <View style={styles.showcaseContent}>
        <Text style={styles.showcaseEyebrow}>你的小伙伴来了</Text>
        <View style={styles.showcaseCard}>
          <Image
            contentFit="cover"
            source={role.image}
            style={[styles.showcaseImage, isVideoReady && styles.hiddenCover]}
          />
          {role.selectedVideo ? (
            <VideoView
              contentFit="cover"
              nativeControls={false}
              onFirstFrameRender={() => setIsVideoReady(true)}
              player={player}
              style={styles.showcaseVideo}
            />
          ) : null}
        </View>
        <Text style={styles.showcaseName}>{role.name}</Text>
        <Text style={styles.showcaseDescription}>
          {role.title}，
          <Text style={styles.showcaseDescription}>{role.description}</Text>
        </Text>
        {!isVideoReady && role.selectedVideo ? (
          <View style={styles.showcaseLoading}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function RoleSelectionScreen() {
  const { completeRoleSelection, selectedRoleId, setSelectedRoleId } = useAppState();
  const { data, error, isLoading, reload } = useRoles();
  const [isConfirming, setIsConfirming] = useState(false);
  const selectedRole = useMemo(
    () => data?.find((role) => role.id === selectedRoleId) ?? null,
    [data, selectedRoleId],
  );

  const handleConfirm = () => {
    if (!selectedRole) {
      return;
    }

    if (selectedRole.selectedVideo) {
      setIsConfirming(true);
      return;
    }

    completeRoleSelection();
    router.replace('/(tabs)');
  };

  const handleShowcaseFinished = () => {
    completeRoleSelection();
    router.replace('/(tabs)');
  };

  return (
    <AppScreen contentStyle={styles.screen} decorativeBackground={false}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityLabel="返回"
          accessibilityRole="button"
          onPress={() => router.replace('/loading')}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
          <Ionicons color="#4B3326" name="chevron-back" size={24} />
        </Pressable>
      </View>

      {isLoading ? <LoadingView body="正在摆好今晚的小伙伴。" title="准备中" /> : null}
      {error ? <ErrorView actionLabel="再试一次" body={error} onAction={reload} title="角色还没到齐" /> : null}

      {data ? (
        <>
          <View style={styles.grid}>
            {data.map((role) => (
              <RoleCard
                key={role.id}
                onPress={() => {
                  if (isConfirming) {
                    return;
                  }

                  setSelectedRoleId(role.id);
                }}
                role={role}
                selected={role.id === selectedRoleId}
              />
            ))}
          </View>
          <PrimaryButton
            disabled={!selectedRoleId || isConfirming}
            label="确认选择"
            loading={isConfirming}
            onPress={handleConfirm}
            style={styles.button}
          />
        </>
      ) : null}

      {isConfirming && selectedRole ? (
        <SelectionShowcase onFinished={handleShowcaseFinished} role={selectedRole} />
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 18,
    paddingBottom: 36,
    paddingTop: 8,
  },
  topBar: {
    height: 52,
    justifyContent: 'center',
    marginBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7EA',
    borderWidth: 1.5,
    borderColor: '#D6C0A5',
  },
  backButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  button: {
    marginTop: 22,
    marginHorizontal: 34,
  },
  showcaseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  showcaseBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 17, 12, 0.4)',
  },
  showcaseContent: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  showcaseEyebrow: {
    marginBottom: 12,
    color: '#FFF7EA',
    textAlign: 'center',
    ...theme.typography.caption,
  },
  showcaseCard: {
    width: '100%',
    aspectRatio: 0.84,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F5D7B0',
  },
  showcaseImage: {
    width: '100%',
    height: '100%',
  },
  showcaseVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  showcaseName: {
    marginTop: 18,
    marginBottom: 8,
    color: '#FFF7EA',
    textAlign: 'center',
    ...theme.typography.headingLG,
  },
  showcaseDescription: {
    color: '#FFF1DA',
    textAlign: 'center',
    ...theme.typography.bodyMD,
  },
  showcaseLoading: {
    marginTop: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7EA',
  },
  hiddenCover: {
    opacity: 0,
  },
});
