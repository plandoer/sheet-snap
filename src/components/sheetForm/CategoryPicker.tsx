import { categories } from "@/data/categoryData";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function CategoryPicker({
  selectedCategory,
  onCategoryChange,
}: Props) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={onCategoryChange}
        style={styles.categoryPicker}
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
});
