import IconButton from "../IconButton";

interface Props {
  onPress: () => void;
}

export default function ExpenseExportIconButton({ onPress }: Props) {
  return (
    <>
      {/* Expense Export Button */}
      <IconButton name="cloud-upload-outline" onPress={onPress} />
    </>
  );
}
