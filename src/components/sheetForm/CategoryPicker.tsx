import { GLOBAL_STYLES } from "@/constants/global-styles";
import { categories } from "@/data/categoryData";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  errorMessage?: string;
}

export default function CategoryPicker({
  selectedCategory,
  onCategoryChange,
  errorMessage,
}: Props) {
  let labelText = "Category";

  if (errorMessage) {
    labelText = errorMessage;
  }
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, errorMessage && styles.labelError]}>
        {labelText}
      </Text>
      <View style={styles.categoryPicker}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={onCategoryChange}
        >
          <Picker.Item label="Select a category" value="" />
          {categories.map((category) => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.name}
            />
          ))}
        </Picker>
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
  categoryPicker: {
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  labelError: {
    color: GLOBAL_STYLES.colors.danger,
  },
});
