import { useExpenseGroups } from "@/hooks/useExpenseGroup";
import { ExpenseGroup } from "@/models/expenseGroup";
import { storageService } from "@/services/storageService";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ContextValue {
  currentGroup: ExpenseGroup | null;
  updateCurrentGroup: (group: ExpenseGroup) => void;
}

const ExpenseGroupContext = createContext<ContextValue | undefined>(undefined);

const STORAGE_KEY = "currentGroup";

export default function ExpenseGroupProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentGroup, setCurrentGroup] = useState<ExpenseGroup | null>(null);
  const { data: expenseGroups } = useExpenseGroups();

  function updateCurrentGroup(group: ExpenseGroup) {
    setCurrentGroup(group);
    storageService.setItem(STORAGE_KEY, group);
  }

  useEffect(() => {
    async function loadCurrentGroup() {
      if (currentGroup) {
        return;
      }

      const savedGroup = await storageService.getItem(STORAGE_KEY);

      if (savedGroup) {
        setCurrentGroup(savedGroup);
        return;
      }

      const firstGroup = expenseGroups?.[0];
      if (firstGroup) {
        setCurrentGroup(firstGroup);
        await storageService.setItem(STORAGE_KEY, firstGroup);
      }
    }
    loadCurrentGroup();
  }, [currentGroup, expenseGroups]);

  const value: ContextValue = {
    currentGroup,
    updateCurrentGroup,
  };

  return <ExpenseGroupContext value={value}>{children}</ExpenseGroupContext>;
}

export function useExpenseGroupContext() {
  const context = useContext(ExpenseGroupContext);
  if (!context) {
    throw new Error(
      "useExpenseGroupContext must be used within an ExpenseGroupProvider",
    );
  }
  return context;
}
