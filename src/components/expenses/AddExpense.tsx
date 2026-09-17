import FAB from "@/components/FAB";
import { useRouter } from "expo-router";

export default function AddExpense() {
  const router = useRouter();

  return <FAB onPress={() => router.push("/expense-details")} />;
}
