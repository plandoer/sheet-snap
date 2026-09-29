import Header from "@/components/Header";
import AddCategory from "@/components/categories/AddCategory";
import CategoryItems from "@/components/categories/CategoryItems";
import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useGroupContext } from "@/context/GroupContext";
import { useCategoriesByGroupId } from "@/hooks/useCategory";
import { StyleSheet, View } from "react-native";

export default function Categories() {
  const { currentGroup } = useGroupContext();
  const {
    data: categories,
    isRefetching,
    refetch,
  } = useCategoriesByGroupId(currentGroup?.id ?? "");

  return (
    <View style={styles.screen}>
      <Header title="Categories" />
      <CategoryItems
        categories={categories ?? []}
        refetch={refetch}
        refreshing={isRefetching}
      />
      <AddCategory />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
  },
});
