import { Category } from "@/models/category";
import type { Tables } from "@/models/supabase/database.types";

export function toCategory(row: Tables<"categories">): Category {
  const category = new Category();
  category.id = row.id;
  category.name = row.name;
  category.groupId = row.group_id;
  category.createdAt = new Date(row.created_at);
  return category;
}
