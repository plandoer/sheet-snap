import { Alert } from "react-native";
import Header from "../Header";
import IconButton from "../ui/IconButton";

interface Props {
  id?: string;
  onDelete: () => void;
}

export default function ExpenseDetailsHeader({ id, onDelete }: Props) {
  const title = id ? "Edit Expense" : "Add Expense";

  function showConfirmDialog() {
    Alert.alert(
      "Delete Expense",
      "Are you sure to delete this expense?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: onDelete,
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  }

  return (
    <Header title={title}>
      {id && (
        <IconButton name="trash" color="danger" onPress={showConfirmDialog} />
      )}
    </Header>
  );
}
