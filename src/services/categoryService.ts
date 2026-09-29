import { Category } from "@/models/category";
import { ErrorType } from "@/models/enums/errorType";
import { TablesInsert } from "@/models/supabase/database.types";
import { toCategory } from "@/utils/categoryUtils";
import { supabase } from "./supabaseAuthService";

export const categoryService = {
  async create(name: string, groupId: string): Promise<Category> {
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
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("group_id", groupId);

    if (error) {
      const customError = new Error("Failed to delete category", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_DELETE_CATEGORY;
      throw customError;
    }
  },
};
