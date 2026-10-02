import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useGroups } from "@/hooks/useGroup";
import { Group } from "@/models/group";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import { Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddGroup from "./AddGroup";
import GroupHeader from "./GroupHeader";
import GroupItems from "./GroupItems";

interface Props {
  visible: boolean;
  onClose: () => void;
  onEdit: (group: Group) => void;
}

export default function GroupsModal({ visible, onClose, onEdit }: Props) {
  const {
    data: groups,
    refetch,
    isLoading,
    isPending,
    isRefetching,
  } = useGroups();

  useEffect(() => {
    if (visible) {
      refetch();
    }
  }, [visible, refetch]);

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <GroupHeader onClose={onClose} />
          <GroupItems
            groups={groups ?? []}
            onRefresh={refetch}
            onClose={onClose}
            loading={isLoading}
            pending={isPending}
            refreshing={isRefetching}
            onEdit={onEdit}
          />
          <AddGroup />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
});
