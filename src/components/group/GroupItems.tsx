import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Group } from "@/models/group";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import GroupItem from "./GroupItem";

interface Props {
  groups: Group[];
  onRefresh: () => void;
  loading: boolean;
  pending: boolean;
  refreshing: boolean;
  onClose: () => void;
  onEdit: (group: Group) => void;
}

export default function GroupItems({
  groups,
  onRefresh,
  onClose,
  loading,
  pending,
  refreshing,
  onEdit,
}: Props) {
  let content = null;

  if (groups.length === 0 && loading) {
    content = (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GLOBAL_STYLES.colors.primary} />
      </View>
    );
  } else if (groups.length === 0 && !pending) {
    content = (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.noGroupsText}>No groups yet.</Text>
      </ScrollView>
    );
  } else {
    content = (
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupItem
            group={item}
            onClose={onClose}
            onEdit={() => onEdit(item)}
          />
        )}
        contentContainerStyle={styles.list}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  noGroupsText: {
    color: GLOBAL_STYLES.colors.disableText,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
