import { useExpenseGroups } from "@/hooks/useExpenseGroup";
import { ExpenseGroup } from "@/models/expenseGroup";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ContextValue {
  currentGroup: ExpenseGroup | null;
  setCurrentGroup: (group: ExpenseGroup | null) => void;
}

const initialValue: ContextValue = {
  currentGroup: null,
  setCurrentGroup: () => {},
};

const ExpenseGroupContext = createContext<ContextValue>(initialValue);

export default function ExpenseGroupProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentGroup, setCurrentGroup] = useState<ExpenseGroup | null>(null);
  const { data: expenseGroups } = useExpenseGroups();

  useEffect(() => {
    if (expenseGroups && expenseGroups.length > 0) {
      setCurrentGroup(expenseGroups[0]);
    }
  }, [expenseGroups]);

  const value: ContextValue = {
    currentGroup,
    setCurrentGroup,
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
