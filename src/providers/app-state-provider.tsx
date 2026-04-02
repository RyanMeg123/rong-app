import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

interface AppStateContextValue {
  selectedRoleId: string | null;
  setSelectedRoleId: (roleId: string | null) => void;
  hasCompletedRoleSelection: boolean;
  completeRoleSelection: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [hasCompletedRoleSelection, setHasCompletedRoleSelection] = useState(false);

  const value = useMemo(
    () => ({
      selectedRoleId,
      setSelectedRoleId,
      hasCompletedRoleSelection,
      completeRoleSelection: () => setHasCompletedRoleSelection(true),
    }),
    [hasCompletedRoleSelection, selectedRoleId],
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
