import { getUserGroups } from "@/services/expenseGroupService";
import { useQuery } from "@tanstack/react-query";

export function useExpenseGroups() {
  return useQuery({
    queryKey: ["expenseGroups"],
    queryFn: getUserGroups,
  });
}
