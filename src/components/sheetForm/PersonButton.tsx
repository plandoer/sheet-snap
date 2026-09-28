import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Person } from "@/models/person";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  person: Person;
  selectedPerson: Person | null;
  onPersonChange: (person: Person) => void;
}

export default function PersonButton({
  person,
  selectedPerson,
  onPersonChange,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.personButton,
        selectedPerson?.id === person.id && styles.personButtonSelected,
      ]}
      onPress={() => onPersonChange(person)}
    >
      <Text
        style={[
          styles.personButtonText,
          selectedPerson?.id === person.id && styles.personButtonTextSelected,
        ]}
      >
        {person.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  personButton: {
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.neutralBorder,
  },
  personButtonSelected: {
    backgroundColor: GLOBAL_STYLES.colors.accentBlue,
    borderColor: GLOBAL_STYLES.colors.accentBlue,
  },
  personButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.neutralText,
  },
  personButtonTextSelected: {
    color: GLOBAL_STYLES.colors.white,
  },
});
