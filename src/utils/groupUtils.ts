import { Group } from "@/models/group";
import { SpreadsheetSheetSelection } from "@/models/spreadsheetSheetSelection";
import { Tables } from "@/models/supabase/database.types";
import { User } from "@/models/user";

type GroupMember = Tables<"group_members">;
type Profile = Tables<"profiles">;
type SpreadsheetSheetSelectionRow = Tables<"spreadsheet_sheet_selections">;

const INVITATION_LINK_BASE_URL =
  process.env.EXPO_PUBLIC_INVITATION_LINK_BASE_URL!;

export function buildInvitationLink(name: string, token: string): string {
  return `${INVITATION_LINK_BASE_URL}?name=${encodeURIComponent(name)}&token=${encodeURIComponent(token)}`;
}

export function toGroup(
  row: Tables<"groups">,
  memberRows: GroupMember[],
  profiles: Map<string, Profile>,
  selectionRow?: SpreadsheetSheetSelectionRow | null,
): Group {
  const group = new Group();
  group.id = row.id;
  group.name = row.name;
  group.createdAt = row.created_at;
  group.invitationToken = row.invitation_token;
  const members = memberRows.filter((member) => member.group_id === row.id);
  group.owner = toUser(profiles.get(row.owner_id), row.owner_id);
  group.members = members
    .filter((member) => member.user_id !== row.owner_id)
    .map((member) => toUser(profiles.get(member.user_id), member.user_id));
  group.spreadsheetSheetSelection = selectionRow
    ? toSpreadsheetSheetSelection(selectionRow)
    : null;
  return group;
}

function toSpreadsheetSheetSelection(
  row: SpreadsheetSheetSelectionRow,
): SpreadsheetSheetSelection {
  return {
    spreadsheet: {
      id: row.spreadsheet_id,
      name: row.spreadsheet_name,
      modifiedTime: row.spreadsheet_modified_time,
    },
    sheet: {
      properties: {
        sheetId: row.sheet_id,
        title: row.sheet_title,
        index: row.sheet_index,
      },
    },
  };
}

function toUser(profile: Profile | undefined, id: string): User {
  const user = new User();
  user.id = id;
  user.name = profile?.name ?? null;
  user.email = profile?.email ?? null;
  user.photo = profile?.photo ?? null;
  return user;
}
