import { useExpenseGroups } from "@/hooks/useExpenseGroup";
import { ExpenseGroup } from "@/models/expenseGroup";
import { storageService } from "@/services/storageService";
import { createContext, ReactNode, useContext, useState } from "react";

interface ContextValue {
  group: ExpenseGroup | null;
  initGroup: () => Promise<void>;
  updateGroup: (group: ExpenseGroup) => void;
}

const CurrentGroupContext = createContext<ContextValue | undefined>(undefined);

const STORAGE_KEY = "currentGroup";

export default function CurrentGroupProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [group, getGroup] = useState<ExpenseGroup | null>(null);
  const { data: expenseGroups } = useExpenseGroups();

  function updateGroup(group: ExpenseGroup) {
    getGroup(group);
    storageService.setItem(STORAGE_KEY, group);
  }

  async function initGroup() {
    const savedGroup = await storageService.getItem(STORAGE_KEY);

    if (savedGroup) {
      getGroup(savedGroup);
      return;
    }

    const firstGroup = expenseGroups?.[0];
    if (firstGroup) {
      getGroup(firstGroup);
      await storageService.setItem(STORAGE_KEY, firstGroup);
    }
  }

  const value: ContextValue = {
    group,
    initGroup,
    updateGroup,
  };

  return <CurrentGroupContext value={value}>{children}</CurrentGroupContext>;
}

export function useCurrentGroupContext() {
  const context = useContext(CurrentGroupContext);
  if (!context) {
    throw new Error(
      "useCurrentGroupContext must be used within a CurrentGroupProvider",
    );
  }
  return context;
}
