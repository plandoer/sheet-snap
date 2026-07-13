import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Person } from "@/models/person";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  persons: Person[];
  selectedPerson: string;
  onPersonChange: (person: string) => void;
  customLabel?: string;
  errorMessage?: string;
}

export default function PersonSelector({
  persons,
  selectedPerson,
  onPersonChange,
  customLabel,
  errorMessage,
}: Props) {
  let labelText = customLabel || "Person";
  if (errorMessage) {
    labelText = errorMessage;
  }

  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, errorMessage && styles.labelError]}>
        {labelText}
      </Text>
      <View style={styles.personContainer}>
        {persons.map((person) => (
          <TouchableOpacity
            key={person.id}
            style={[
              styles.personButton,
              selectedPerson === person.name && styles.personButtonSelected,
            ]}
            onPress={() => onPersonChange(person.name)}
          >
            <Text
              style={[
                styles.personButtonText,
                selectedPerson === person.name &&
                  styles.personButtonTextSelected,
              ]}
            >
              {person.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textDark,
    marginBottom: 8,
  },
  personContainer: {
    flexDirection: "row",
    gap: 12,
  },
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
  labelError: {
    color: GLOBAL_STYLES.colors.danger,
  },
});
