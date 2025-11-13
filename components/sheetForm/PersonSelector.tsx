import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PersonSelector() {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Person</Text>
      <View style={styles.personContainer}>
        <TouchableOpacity
          style={[
            styles.personButton,
            formData.selectedPerson === "Ye" && styles.personButtonSelected,
          ]}
          onPress={() =>
            setFormData((prev) => ({ ...prev, selectedPerson: "Ye" }))
          }
        >
          <Text
            style={[
              styles.personButtonText,
              formData.selectedPerson === "Ye" &&
                styles.personButtonTextSelected,
            ]}
          >
            Ye
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.personButton,
            formData.selectedPerson === "Pont" && styles.personButtonSelected,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            setFormData((prev) => ({ ...prev, selectedPerson: "Pont" }))
          }
        >
          <Text
            style={[
              styles.personButtonText,
              formData.selectedPerson === "Pont" &&
                styles.personButtonTextSelected,
            ]}
          >
            Pont
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.personButton,
            formData.selectedPerson === "Both" && styles.personButtonSelected,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            setFormData((prev) => ({ ...prev, selectedPerson: "Both" }))
          }
        >
          <Text
            style={[
              styles.personButtonText,
              formData.selectedPerson === "Both" &&
                styles.personButtonTextSelected,
            ]}
          >
            Both
          </Text>
        </TouchableOpacity>
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
