import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Category } from "@/models/category";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { RefObject, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../IconButton";

interface Props {
  category?: Category;
  sheetRef: RefObject<BottomSheetModal | null>;
  onSave: (name: string) => void;
  onDelete?: () => void;
}

export default function CategorySheet({
  category,
  sheetRef,
  onSave,
  onDelete,
}: Props) {
  const [nameValue, setNameValue] = useState("");

  const isEditMode = !!category;
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
      "Delete Category",
      "Are you sure you want to delete this category?",
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
    setNameValue(category?.name || "");
  }

  useEffect(() => {
    if (category) {
      setNameValue(category.name);
    }
  }, [category]);

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
            {isEditMode ? "Edit Category" : "Add Category"}
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
            placeholder="e.g. Groceries"
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
          accessibilityLabel="Add category"
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
