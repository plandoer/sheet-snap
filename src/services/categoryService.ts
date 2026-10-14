import { Category } from "@/models/category";
import { ErrorType } from "@/models/enums/errorType";
import { TablesInsert } from "@/models/supabase/database.types";
import { toCategory } from "@/utils/categoryUtils";
import { supabase } from "./supabaseAuthService";

export const categoryService = {
  async create(name: string, groupId?: string): Promise<Category> {
    if (!groupId) {
      const error = new Error("Group ID is required to create a category");
      error.name = ErrorType.NO_CURRENT_GROUP;
      throw error;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      const customError = new Error("Category name is required");
      customError.name = ErrorType.FAILED_TO_CREATE_CATEGORY;
      throw customError;
    }

    const payload: TablesInsert<"categories"> = {
      group_id: groupId,
      name: trimmedName,
    };

    const { data: categoryRow, error } = await supabase
      .from("categories")
      .insert(payload)
      .select("*")
      .single();

    if (error || !categoryRow) {
      const customError = new Error("Failed to create category", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_CREATE_CATEGORY;
      throw customError;
    }

    return toCategory(categoryRow);
  },

  async getByGroupId(groupId: string): Promise<Category[]> {
    const { data: categoryRows, error } = await supabase
      .from("categories")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      const customError = new Error(
        `Failed to fetch categories for group ${groupId}`,
        { cause: error },
      );
      customError.name = ErrorType.FAILED_TO_FETCH_CATEGORIES;
      throw customError;
    }

    return categoryRows.map(toCategory);
  },

  async update(id: string, name: string, groupId: string): Promise<Category> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      const customError = new Error("Category name is required");
      customError.name = ErrorType.FAILED_TO_UPDATE_CATEGORY;
      throw customError;
    }

    const payload: Partial<TablesInsert<"categories">> = {
      name: trimmedName,
    };

    const { data: categoryRow, error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", id)
      .eq("group_id", groupId)
      .select("*")
      .single();

    if (error || !categoryRow) {
      const customError = new Error("Failed to update category", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_UPDATE_CATEGORY;
      throw customError;
    }

    return toCategory(categoryRow);
  },

  async delete(id: string, groupId: string): Promise<void> {
    const { count, error: usageError } = await supabase
      .from("expenses")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (usageError) {
      const customError = new Error("Failed to delete category", {
        cause: usageError,
      });
      customError.name = ErrorType.FAILED_TO_DELETE_CATEGORY;
      throw customError;
    }

    if (count) {
      const inUseError = new Error("Category is used in existing expenses");
      inUseError.name = ErrorType.CATEGORY_IN_USE;
      throw inUseError;
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("group_id", groupId);

    if (error?.code === "23503") {
      const inUseError = new Error("Category is used in existing expenses");
      inUseError.name = ErrorType.CATEGORY_IN_USE;
      throw inUseError;
    }

    if (error) {
      const customError = new Error("Failed to delete category", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_DELETE_CATEGORY;
      throw customError;
    }
  },
};
