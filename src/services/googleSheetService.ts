import { ErrorType } from "@/models/enums/errorType";
import type { GoogleSheet } from "@/models/googleSheet";
import type { GoogleSpreadsheet } from "@/models/googleSpreadSheet";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const googleSheetService = {
  async fetchSheets(spreadsheetId: string): Promise<GoogleSheet[]> {
    const tokens = await GoogleSignin.getTokens();

    if (!tokens.accessToken) {
      const error = new Error("No Google Access Token available");
      error.name = ErrorType.NO_GOOGLE_ACCESS_TOKEN;
      throw error;
    }

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      const error = new Error("Google access token is invalid or revoked");
      error.name = ErrorType.TOKEN_REVOKED;
      throw error;
    }

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to fetch sheets", { cause: errorText });
      error.name = ErrorType.FAILED_TO_FETCH_SHEETS;
      throw error;
    }

    const data = await response.json();
    return data.sheets || [];
  },

  async fetchSpreadsheets(): Promise<GoogleSpreadsheet[]> {
    const tokens = await GoogleSignin.getTokens();

    if (!tokens.accessToken) {
      const error = new Error("No Google Access Token available");
      error.name = ErrorType.NO_GOOGLE_ACCESS_TOKEN;
      throw error;
    }

    const response = await fetch(
      "https://www.googleapis.com/drive/v3/files?" +
        new URLSearchParams({
          q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
          orderBy: "modifiedTime desc",
          fields: "files(id,name,modifiedTime)",
          pageSize: "50",
        }),
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      const error = new Error("Google access token is invalid or revoked");
      error.name = ErrorType.TOKEN_REVOKED;
      throw error;
    }

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to fetch sheets", { cause: errorText });
      error.name = ErrorType.FAILED_TO_FETCH_SHEETS;
      throw error;
    }

    const data = await response.json();
    return data.files || [];
  },

  async appendToSheet(
    spreadsheetId: string,
    sheetName: string,
    values: (string | number)[][],
  ): Promise<void> {
    const tokens = await GoogleSignin.getTokens();

    if (!tokens.accessToken) {
      const error = new Error("No Google Access Token available");
      error.name = ErrorType.NO_GOOGLE_ACCESS_TOKEN;
      throw error;
    }

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:F:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
        }),
      },
    );

    if (response.status === 401) {
      const error = new Error("Google access token is invalid or revoked");
      error.name = ErrorType.TOKEN_REVOKED;
      throw error;
    }

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Failed to append to sheet", {
        cause: errorText,
      });
      error.name = ErrorType.FAILED_TO_APPEND_TO_SHEET;
      throw error;
    }
  },
};
