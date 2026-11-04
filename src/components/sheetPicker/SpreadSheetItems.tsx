import { GLOBAL_STYLES } from "@/constants/global-styles";
import { GoogleSpreadsheet } from "@/models/googleSpreadSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SpreadSheetItem from "./SpreadSheetItem";

interface Props {
  spreadsheets: GoogleSpreadsheet[];
  isLoading: boolean;
  onClick: (spreadsheet: GoogleSpreadsheet) => void;
}

export default function SpreadSheetItems({
  spreadsheets,
  isLoading,
  onClick,
}: Props) {
  let content = null;

  if (isLoading) {
    content = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GLOBAL_STYLES.colors.primary} />
        <Text style={styles.loadingText}>Loading your spreadsheets...</Text>
      </View>
    );
  } else if (!isLoading && spreadsheets.length === 0) {
    content = (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={64}
          color={GLOBAL_STYLES.colors.lightBorder}
        />
        <Text style={styles.emptyText}>No spreadsheets found</Text>
        <Text style={styles.emptySubtext}>
          Create a spreadsheet in Google Sheets first
        </Text>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={spreadsheets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SpreadSheetItem spreadsheet={item} onClick={onClick} />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: GLOBAL_STYLES.colors.textMedium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textMedium,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: GLOBAL_STYLES.colors.textMuted,
    marginTop: 8,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
});
