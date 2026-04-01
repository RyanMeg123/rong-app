import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { ROLE_OPTIONS } from '@/data/mock-data';

interface AppStateContextValue {
  selectedRoleId: string;
  setSelectedRoleId: (roleId: string) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [selectedRoleId, setSelectedRoleId] = useState(ROLE_OPTIONS[0]?.id ?? 'rabbit');

  const value = useMemo(
    () => ({
      selectedRoleId,
      setSelectedRoleId,
    }),
    [selectedRoleId],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }

  return context;
}
