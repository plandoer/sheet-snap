import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useThrottledCallback } from "@/hooks/useThrottledCallback";
import { Ionicons } from "@expo/vector-icons";
import { MenuView } from "@react-native-menu/menu";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import GroupButton from "../group/GroupButton";
import SheetSaveButton from "../sheetSave/SheetSaveButton";

const menuActions = [
  {
    id: "equal-pay",
    title: "Equal Pay",
  },
  {
    id: "history",
    title: "History",
  },
];

export default function ExpenseHeader() {
  const router = useRouter();

  const goToEqualPay = useThrottledCallback(() => {
    router.push("/equal-pay");
  });

  function handleMenuAction(event: string) {
    switch (event) {
      case "equal-pay":
        goToEqualPay();
        break;
      case "history":
        Alert.alert(
          "History",
          "A dedicated history view is not available yet.",
        );
        break;
      default:
        break;
    }
  }

  return (
    <View style={styles.container}>
      {/* Expense Group Button */}
      <GroupButton />

      <View style={styles.rightActions}>
        {/* Save To Sheet Button */}
        <SheetSaveButton />

        <MenuView
          actions={menuActions}
          onPressAction={({ nativeEvent }) =>
            handleMenuAction(nativeEvent.event)
          }
        >
          <View style={styles.moreButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={GLOBAL_STYLES.colors.primary}
            />
          </View>
        </MenuView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: GLOBAL_STYLES.colors.backgroundColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GLOBAL_STYLES.colors.borderLight,
  },
  rightActions: {
    flexDirection: "row",
    gap: 4,
  },
  moreButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
