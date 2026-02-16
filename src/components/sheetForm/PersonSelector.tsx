import { persons } from "@/data/personData";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  selectedPerson: string;
  onPersonChange: (person: string) => void;
};

export default function PersonSelector({
  selectedPerson,
  onPersonChange,
}: Props) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Person</Text>
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
    color: "#333",
    marginBottom: 8,
  },
  personContainer: {
    flexDirection: "row",
    gap: 12,
  },
  personButton: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  personButtonSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  personButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#495057",
  },
  personButtonTextSelected: {
    color: "#fff",
  },
});
