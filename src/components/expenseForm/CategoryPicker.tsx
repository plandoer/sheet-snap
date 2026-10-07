import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Category } from "@/models/category";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  categories: Category[];
  selectedCategoryId?: string;
  onCategoryChange: (category: Category) => void;
  loading?: boolean;
  pending?: boolean;
  errorMessage?: string;
  showManageCategories?: boolean;
}

export default function CategoryPicker({
  categories,
  selectedCategoryId,
  onCategoryChange,
  loading = false,
  pending = false,
  errorMessage,
  showManageCategories = true,
}: Props) {
  const router = useRouter();
  let labelText = "Category";
  let content = null;

  if (errorMessage) {
    labelText = errorMessage;
  }

  function handleValueChange(categoryId: string) {
    const category = categories.find((c) => c.id === categoryId);
    if (category) onCategoryChange(category);
  }

  function handleManageCategoriesPress() {
    router.push("/categories");
  }

  if (categories.length === 0 && loading) {
    content = (
      <View style={styles.loadingCategory}>
        <View style={styles.categorySkeleton} />
      </View>
    );
  } else if (categories.length === 0 && !pending) {
    content = (
      <View style={styles.emptyCategoryCard}>
        <Text style={styles.emptyCategoryText}>No categories yet</Text>
        <Text style={styles.emptyCategoryHint}>
          Tap &quot;Manage categories&quot; above to add one
        </Text>
      </View>
    );
  } else {
    content = (
      <View style={styles.categoryPicker}>
        <Picker
          selectedValue={selectedCategoryId}
          onValueChange={handleValueChange}
        >
          <Picker.Item label="Select a category" value="" />
          {categories.map((category) => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id}
            />
          ))}
        </Picker>
      </View>
    );
  }

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, errorMessage && styles.labelError]}>
          {labelText}
        </Text>
        {showManageCategories && (
          <TouchableOpacity onPress={handleManageCategoriesPress}>
            <Text style={styles.manageCategoriesLink}>Manage categories</Text>
          </TouchableOpacity>
        )}
      </View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textDark,
  },
  manageCategoriesLink: {
    fontSize: 14,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.primary,
  },
  categoryPicker: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: GLOBAL_STYLES.colors.borderColor,
    borderRadius: 8,
    backgroundColor: GLOBAL_STYLES.colors.white,
  },
  labelError: {
    color: GLOBAL_STYLES.colors.danger,
  },
  emptyCategoryCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: GLOBAL_STYLES.colors.lightBorder,
    borderRadius: 8,
    backgroundColor: GLOBAL_STYLES.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 4,
  },
  loadingCategory: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
    borderRadius: 8,
    backgroundColor: GLOBAL_STYLES.colors.white,
  },
  categorySkeleton: {
    width: 148,
    height: 14,
    borderRadius: 999,
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
  },
  emptyCategoryText: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textMuted,
  },
  emptyCategoryHint: {
    fontSize: 13,
    color: GLOBAL_STYLES.colors.placeholderText,
  },
});
