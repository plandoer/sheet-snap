import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Person } from "@/models/person";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { RefObject, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../ui/IconButton";

interface Props {
  person?: Person;
  sheetRef: RefObject<BottomSheetModal | null>;
  onSave: (name: string) => void;
  onDelete?: () => void;
}

export default function PersonSheet({
  person,
  sheetRef,
  onSave,
  onDelete,
}: Props) {
  const [nameValue, setNameValue] = useState("");

  const isEditMode = !!person;
  const disabled = !nameValue.trim();

  function handleClose() {
    resetModal();
    sheetRef.current?.dismiss();
  }

  function handleAdd() {
    const nameTrimmed = nameValue.trim();

    if (!nameTrimmed) return;

    onSave(nameTrimmed);
    handleClose();
  }

  function renderBackdrop(props: any) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  }

  function showConfirmDialog() {
    Alert.alert(
      "Delete Person",
      "Are you sure to delete this person?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: onDelete,
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  }

  function resetModal() {
    setNameValue(person?.name || "");
  }

  useEffect(() => {
    if (person) {
      setNameValue(person.name);
    }
  }, [person]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={styles.sheetContent}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>
            {isEditMode ? "Edit Person" : "Add Person"}
          </Text>

          <View style={styles.buttonContainer}>
            {/* Delete Button */}

            {isEditMode && onDelete && (
              <IconButton
                name="trash"
                color="danger"
                onPress={showConfirmDialog}
              />
            )}
            {/* Close Button */}
            <IconButton name="close" color="gray" onPress={handleClose} />
          </View>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Name</Text>
          <BottomSheetTextInput
            style={styles.fieldInput}
            value={nameValue}
            onChangeText={setNameValue}
            placeholder="e.g. John Doe"
            placeholderTextColor={GLOBAL_STYLES.colors.placeholderText}
            maxLength={50}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.addButton, disabled && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Add person"
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  handleIndicator: {
    backgroundColor: GLOBAL_STYLES.colors.dividerLight,
    width: 40,
  },
  sheetBackground: {
    backgroundColor: GLOBAL_STYLES.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 36,
    backgroundColor: GLOBAL_STYLES.colors.white,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: GLOBAL_STYLES.colors.textInk,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textSubtle,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: GLOBAL_STYLES.colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: GLOBAL_STYLES.colors.textInk,
  },
  addButton: {
    marginTop: 8,
    backgroundColor: GLOBAL_STYLES.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    color: GLOBAL_STYLES.colors.white,
    fontWeight: "600",
  },
  addButtonDisabled: {
    backgroundColor: GLOBAL_STYLES.colors.lightBorder,
  },
});
