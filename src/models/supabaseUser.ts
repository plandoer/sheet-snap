import {
  Factor,
  FactorType,
  UserAppMetadata,
  UserIdentity,
  UserMetadata,
} from "@supabase/supabase-js";

export class SupabaseUser {
  id: string = "";
  app_metadata: UserAppMetadata = {} as UserAppMetadata;
  user_metadata: UserMetadata = {} as UserMetadata;
  aud: string = "";
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  new_phone?: string;
  invited_at?: string;
  action_link?: string;
  email?: string;
  phone?: string;
  created_at: string = "";
  confirmed_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
  identities?: UserIdentity[];
  is_anonymous?: boolean;
  is_sso_user?: boolean;
  factors?: (
    | Factor<FactorType, "verified">
    | Factor<FactorType, "unverified">
  )[];
  deleted_at?: string;
  banned_until?: string;
}
