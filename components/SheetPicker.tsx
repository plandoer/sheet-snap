import { useSheet } from "@/context/SheetContext";
import {
  fetchGoogleSpreadsheets,
  GoogleSpreadsheet,
} from "@/services/google-drive";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SheetPickerProps {
  visible: boolean;
  onClose: () => void;
}

export default function SheetPicker({ visible, onClose }: SheetPickerProps) {
  const [spreadsheets, setSpreadsheets] = useState<GoogleSpreadsheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedSheet } = useSheet();

  useEffect(() => {
    if (visible) {
      loadSpreadsheets();
    }
  }, [visible]);

  async function loadSpreadsheets() {
    try {
      setIsLoading(true);
      const sheets = await fetchGoogleSpreadsheets();
      setSpreadsheets(sheets);
    } catch (error: any) {
      console.error("Error loading spreadsheets:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to load your spreadsheets. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectSheet(sheet: GoogleSpreadsheet) {
    setSelectedSheet({
      id: sheet.id,
      name: sheet.name,
    });
    onClose();
  }

  function renderSheetItem({ item }: { item: GoogleSpreadsheet }) {
    return (
      <TouchableOpacity
        style={styles.sheetItem}
        onPress={() => handleSelectSheet(item)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="google-spreadsheet"
          size={24}
          color="#34A853"
          style={styles.sheetIcon}
        />
        <View style={styles.sheetInfo}>
          <Text style={styles.sheetName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.sheetDate}>
            Modified: {new Date(item.modifiedTime).toLocaleDateString()}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select a Google Sheet</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#34A853" />
            <Text style={styles.loadingText}>Loading your spreadsheets...</Text>
          </View>
        ) : spreadsheets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={64}
              color="#ccc"
            />
            <Text style={styles.emptyText}>No spreadsheets found</Text>
            <Text style={styles.emptySubtext}>
              Create a spreadsheet in Google Sheets first
            </Text>
          </View>
        ) : (
          <FlatList
            data={spreadsheets}
            keyExtractor={(item) => item.id}
            renderItem={renderSheetItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
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
    color: "#666",
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
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e1e5e9",
  },
  sheetIcon: {
    marginRight: 12,
  },
  sheetInfo: {
    flex: 1,
  },
  sheetName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  sheetDate: {
    fontSize: 12,
    color: "#999",
  },
  separator: {
    height: 12,
  },
});
