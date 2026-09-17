import { useGroups } from "@/hooks/useGroup";
import { Group } from "@/models/group";
import { storageService } from "@/services/storageService";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface ContextValue {
  currentGroup: Group | null;
  initCurrentGroup: () => Promise<void>;
  updateAndPersistCurrentGroup: (group: Group) => void;
  resetCurrentGroup: () => Promise<void>;
}

const GroupContext = createContext<ContextValue | undefined>(undefined);

const STORAGE_KEY = "currentGroup";

export default function GroupProvider({ children }: { children: ReactNode }) {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  const { data: groups, isSuccess: isGroupsReady } = useGroups();
  const groupsRef = useRef(groups);
  groupsRef.current = groups;

  const hasInitializedRef = useRef(false);

  const initCurrentGroup = useCallback(async () => {
    const savedGroup = await storageService.getItem(STORAGE_KEY);

    if (savedGroup) {
      setCurrentGroup(savedGroup);
      return;
    }

    const firstGroup = groupsRef.current?.[0];
    if (firstGroup) {
      setCurrentGroup(firstGroup);
      await storageService.setItem(STORAGE_KEY, firstGroup);
    }
  }, []);

  const updateAndPersistCurrentGroup = useCallback((newGroup: Group) => {
    setCurrentGroup(newGroup);
    storageService.setItem(STORAGE_KEY, newGroup);
  }, []);

  const resetCurrentGroup = useCallback(async () => {
    hasInitializedRef.current = false;
    setCurrentGroup(null);
    await storageService.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!isGroupsReady || hasInitializedRef.current) {
      return;
    }
    hasInitializedRef.current = true;
    initCurrentGroup();
  }, [isGroupsReady, initCurrentGroup]);

  const value = useMemo<ContextValue>(
    () => ({
      currentGroup,
      initCurrentGroup,
      updateAndPersistCurrentGroup,
      resetCurrentGroup,
    }),
    [
      currentGroup,
      initCurrentGroup,
      updateAndPersistCurrentGroup,
      resetCurrentGroup,
    ],
  );

  return <GroupContext value={value}>{children}</GroupContext>;
}

export function useGroupContext() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroupContext must be used within a GroupProvider");
  }
  return context;
}
