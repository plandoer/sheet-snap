import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useDeleteCategory, useUpdateCategory } from "@/hooks/useCategory";
import { Category } from "@/models/category";
import { formatRelativeTime } from "@/utils/dateUtils";
import { getErrorInfo } from "@/utils/errorUtils";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import CategorySheet, { CategorySheetRef } from "./CategorySheet";

interface Props {
  category: Category;
}

export default function CategoryItem({ category }: Props) {
  const categoryBottomSheetRef = useRef<CategorySheetRef | null>(null);
  const { mutateAsync: updateCategoryAsync } = useUpdateCategory();
  const { mutateAsync: deleteCategoryAsync } = useDeleteCategory();

  async function handleCategoryUpdate(name: string) {
    try {
      await updateCategoryAsync({
        id: category.id,
        name,
        groupId: category.groupId,
      });
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  async function handleDeleteCategory() {
    try {
      await deleteCategoryAsync({ id: category.id, groupId: category.groupId });
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      Alert.alert(errorInfo.title, errorInfo.message);
    }
  }

  function openCategoryDialog() {
    categoryBottomSheetRef.current?.present();
  }

  return (
    <>
      {/* Category Card */}
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && styles.containerPressed,
        ]}
        onPress={openCategoryDialog}
        android_ripple={{
          color: GLOBAL_STYLES.colors.surfaceMuted,
          borderless: false,
          foreground: true,
          radius: 220,
        }}
      >
        <View style={styles.avatar}>
          {/* Category Icon */}
          <Ionicons
            name="pricetag"
            size={20}
            color={GLOBAL_STYLES.colors.textPrimary}
          />
        </View>
        <View style={styles.info}>
          {/* Category Name */}
          <Text style={styles.name}>{category.name}</Text>
          <Text style={styles.date}>
            {/* Category Created Date */}
            Added {formatRelativeTime(category.createdAt)}
          </Text>
        </View>
      </Pressable>
      {/* Category Bottom Sheet */}
      <CategorySheet
        ref={categoryBottomSheetRef}
        category={category}
        onSave={handleCategoryUpdate}
        onDelete={handleDeleteCategory}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
    borderRadius: 12,
    overflow: "hidden",
  },
  containerPressed: {
    opacity: 0.92,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textPrimary,
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: GLOBAL_STYLES.colors.textSecondary,
  },
});
