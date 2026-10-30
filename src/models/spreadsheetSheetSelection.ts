import { GoogleSheet } from "./googleSheet";
import { GoogleSpreadsheet } from "./googleSpreadSheet";

export interface SpreadsheetSheetSelection {
  spreadsheet: GoogleSpreadsheet;
  sheet: GoogleSheet;
}
