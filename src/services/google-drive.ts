import { GoogleSignin } from "@react-native-google-signin/google-signin";

export interface GoogleSpreadsheet {
  id: string;
  name: string;
  modifiedTime: string;
}

export interface GoogleSheet {
  properties: {
    sheetId: number;
    title: string;
    index: number;
  };
}

/**
 * Fetch all sheets (tabs) from a specific Google Spreadsheet
 */
export async function fetchGoogleSheets(
  spreadsheetId: string
): Promise<GoogleSheet[]> {
  try {
    const tokens = await GoogleSignin.getTokens();

    if (!tokens.accessToken) {
      throw new Error("No access token available");
    }

    // Use Google Sheets API to get spreadsheet metadata including sheets
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch sheets: ${errorText}`);
    }

    const data = await response.json();
    return data.sheets || [];
  } catch (error) {
    console.error("Error fetching Google Sheets:", error);
    throw error;
  }
}

/**
 * Fetch all Google Spreadsheets from the user's Google Drive
 */
export async function fetchGoogleSpreadsheets(): Promise<GoogleSpreadsheet[]> {
  try {
    const tokens = await GoogleSignin.getTokens();

    if (!tokens.accessToken) {
      throw new Error("No access token available");
    }

    // Use Google Drive API to list spreadsheets
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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch spreadsheets: ${errorText}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error("Error fetching Google Spreadsheets:", error);
    throw error;
  }
}

/**
 * Append a new row to a Google Sheet
 */
export async function appendToGoogleSheet(
  spreadsheetId: string,
  sheetName: string,
  values: (string | number)[][]
): Promise<void> {
  try {
    const tokens = await GoogleSignin.getTokens();

    if (!tokens.accessToken) {
      throw new Error("No access token available");
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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to append to sheet: ${errorText}`);
    }
  } catch (error) {
    console.error("Error appending to Google Sheet:", error);
    throw error;
  }
}
