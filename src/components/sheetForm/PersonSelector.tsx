import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Person } from "@/models/person";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  let labelText = customLabel || "Person";
  let content = null;

  function handleAddPersonPress() {
    router.push("/persons");
  }

  if (errorMessage) {
    labelText = errorMessage;
  }

  if (persons.length === 0) {
    content = (
      // Add Person Card
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.addPersonCard}
        onPress={handleAddPersonPress}
      >
        <Text style={styles.addPersonPlus}>+</Text>
        <Text style={styles.addPersonText}>Add new person</Text>
      </TouchableOpacity>
    );
  } else {
    content = (
      <View style={styles.personContainer}>
        {persons.map((person) => (
          // Person Button
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
    );
  }

  return (
    <View style={styles.fieldContainer}>
      {/* Person Label */}
      <Text style={[styles.label, errorMessage && styles.labelError]}>
        {labelText}
      </Text>
      {content}
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
  addPersonCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: GLOBAL_STYLES.colors.black,
    borderRadius: 8,
    backgroundColor: GLOBAL_STYLES.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  addPersonPlus: {
    fontSize: 34,
    lineHeight: 20,
    color: GLOBAL_STYLES.colors.neutralGray,
    marginBottom: 2,
  },
  addPersonText: {
    fontSize: 18,
    color: GLOBAL_STYLES.colors.textMuted,
  },
});
