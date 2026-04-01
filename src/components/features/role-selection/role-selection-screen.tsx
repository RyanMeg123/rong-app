import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ErrorView, LoadingView } from '@/components/ui/status-view';
import { theme } from '@/constants/theme';
import { useRoles } from '@/hooks/use-roles';
import { useAppState } from '@/providers/app-state-provider';

import { RoleCard } from './role-card';

export function RoleSelectionScreen() {
  const { selectedRoleId, setSelectedRoleId } = useAppState();
  const { data, error, isLoading, reload } = useRoles();

  const handleConfirm = () => {
    router.replace('/(tabs)');
  };

  return (
    <AppScreen contentStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.leafLeft} />
        <View style={styles.leafRight} />
        <Text style={styles.title}>角色选择</Text>
      </View>

      {isLoading ? <LoadingView body="正在摆好今晚的小伙伴。" title="准备中" /> : null}
      {error ? <ErrorView actionLabel="再试一次" body={error} onAction={reload} title="角色还没到齐" /> : null}

      {data ? (
        <>
          <View style={styles.grid}>
            {data.map((role) => (
              <RoleCard
                key={role.id}
                onPress={() => setSelectedRoleId(role.id)}
                role={role}
                selected={role.id === selectedRoleId}
              />
            ))}
          </View>
          <PrimaryButton label="确认选择" onPress={handleConfirm} style={styles.button} />
        </>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 18,
    paddingBottom: 36,
  },
  header: {
    height: 118,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  leafLeft: {
    position: 'absolute',
    left: 6,
    top: 18,
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: '#BCE0C0',
    opacity: 0.7,
  },
  leafRight: {
    position: 'absolute',
    right: 10,
    top: 24,
    width: 88,
    height: 68,
    borderRadius: 24,
    backgroundColor: '#CFE8A0',
    opacity: 0.65,
  },
  title: {
    color: '#1F120C',
    ...theme.typography.headingXL,
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
});
