export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      each_shares: {
        Row: {
          amount: string;
          expense_id: string;
          id: string;
          person_id: string;
        };
        Insert: {
          amount: string;
          expense_id: string;
          id?: string;
          person_id: string;
        };
        Update: {
          amount?: string;
          expense_id?: string;
          id?: string;
          person_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "each_shares_expense_id_fkey";
            columns: ["expense_id"];
            isOneToOne: false;
            referencedRelation: "expenses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "each_shares_person_id_fkey";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "persons";
            referencedColumns: ["id"];
          },
        ];
      };
      expense_groups: {
        Row: {
          created_at: string;
          id: string;
          invitation_token: string | null;
          name: string;
          owner_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          invitation_token?: string | null;
          name: string;
          owner_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          invitation_token?: string | null;
          name?: string;
          owner_id?: string;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          amount: string;
          category: string | null;
          created_at: string;
          currency: string;
          date: string;
          excluded: boolean;
          group_id: string;
          id: string;
          note: string | null;
          paid_by: string | null;
          reason: string | null;
          split_in_half: boolean;
          user_id: string;
        };
        Insert: {
          amount: string;
          category?: string | null;
          created_at?: string;
          currency?: string;
          date: string;
          excluded?: boolean;
          group_id: string;
          id?: string;
          note?: string | null;
          paid_by?: string | null;
          reason?: string | null;
          split_in_half?: boolean;
          user_id: string;
        };
        Update: {
          amount?: string;
          category?: string | null;
          created_at?: string;
          currency?: string;
          date?: string;
          excluded?: boolean;
          group_id?: string;
          id?: string;
          note?: string | null;
          paid_by?: string | null;
          reason?: string | null;
          split_in_half?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "expense_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_paid_by_fkey";
            columns: ["paid_by"];
            isOneToOne: false;
            referencedRelation: "persons";
            referencedColumns: ["id"];
          },
        ];
      };
      group_members: {
        Row: {
          group_id: string;
          id: string;
          joined_at: string;
          user_id: string;
        };
        Insert: {
          group_id: string;
          id?: string;
          joined_at?: string;
          user_id: string;
        };
        Update: {
          group_id?: string;
          id?: string;
          joined_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "expense_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      persons: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          email: string | null;
          id: string;
          name: string | null;
          photo: string | null;
        };
        Insert: {
          email?: string | null;
          id: string;
          name?: string | null;
          photo?: string | null;
        };
        Update: {
          email?: string | null;
          id?: string;
          name?: string | null;
          photo?: string | null;
        };
        Relationships: [];
      };
      sub_amounts: {
        Row: {
          amount: string;
          expense_id: string;
          id: string;
          reason: string | null;
        };
        Insert: {
          amount: string;
          expense_id: string;
          id?: string;
          reason?: string | null;
        };
        Update: {
          amount?: string;
          expense_id?: string;
          id?: string;
          reason?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sub_amounts_expense_id_fkey";
            columns: ["expense_id"];
            isOneToOne: false;
            referencedRelation: "expenses";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_expense_with_sub_amounts: {
        Args: {
          p_amount: string;
          p_category: string | null;
          p_currency: string;
          p_date: string;
          p_each_shares: Json;
          p_excluded: boolean;
          p_group_id: string;
          p_note: string | null;
          p_paid_by: string | null;
          p_reason: string | null;
          p_split_in_half: boolean;
          p_sub_amounts: Json;
          p_user_id: string;
        };
        Returns: Json;
      };
      get_group_by_invitation_token: {
        Args: { p_token: string };
        Returns: {
          id: string;
          name: string;
        }[];
      };
      get_or_create_group_invitation_token: {
        Args: { p_group_id: string };
        Returns: string;
      };
      is_group_member: {
        Args: { p_group_id: string; p_user_id?: string };
        Returns: boolean;
      };
      join_group_by_invitation_token: {
        Args: { p_token: string };
        Returns: {
          id: string;
          name: string;
        }[];
      };
      update_expense_with_sub_amounts: {
        Args: {
          p_amount: string;
          p_category: string | null;
          p_currency: string;
          p_date: string;
          p_each_shares: Json;
          p_excluded: boolean;
          p_expense_id: string;
          p_group_id: string;
          p_note: string | null;
          p_paid_by: string | null;
          p_reason: string | null;
          p_split_in_half: boolean;
          p_sub_amounts: Json;
          p_user_id: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
