import FAB from "@/components/ui/FAB";

interface Props {
  onAdd: () => void;
}

export default function AddPerson({ onAdd }: Props) {
  return <FAB onPress={onAdd} />;
}
