import { Alert } from "react-native";
import Header from "../Header";
import IconButton from "../ui/IconButton";

interface Props {
  title: string;
  onDelete: () => void;
}

export default function ExpenseDetailsHeader({ title, onDelete }: Props) {
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
      <IconButton name="trash" color="danger" onPress={showConfirmDialog} />
    </Header>
  );
}
