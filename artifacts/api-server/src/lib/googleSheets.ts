import { google } from "googleapis";
import { logger } from "./logger";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

function formatSheetRange(sheetName: string) {
  const escapedSheetName = sheetName.replaceAll("'", "''");
  return `'${escapedSheetName}'!A1`;
}

async function ensureSheetExists(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetName: string,
) {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });

  const exists = spreadsheet.data.sheets?.some(
    (sheet) => sheet.properties?.title === sheetName,
  );

  if (exists) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetName,
            },
          },
        },
      ],
    },
  });
}

function getAuth() {
  if (!SERVICE_ACCOUNT_KEY) {
    logger.warn("GOOGLE_SERVICE_ACCOUNT_KEY not set — Google Sheets sync disabled");
    return null;
  }
  try {
    const credentials = JSON.parse(SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return auth;
  } catch (err) {
    logger.error({ err }, "Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY");
    return null;
  }
}

export async function appendToSheet(sheetName: string, values: string[][]): Promise<void> {
  if (!SPREADSHEET_ID) {
    logger.warn("GOOGLE_SHEETS_ID not set — skipping Google Sheets sync");
    return;
  }
  const auth = getAuth();
  if (!auth) return;

  try {
    const sheets = google.sheets({ version: "v4", auth });
    await ensureSheetExists(sheets, SPREADSHEET_ID, sheetName);
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: formatSheetRange(sheetName),
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });
    logger.info({ sheetName, rows: values.length }, "Appended rows to Google Sheets");
  } catch (err) {
    logger.error({ err, sheetName }, "Failed to append to Google Sheets — continuing anyway");
    // Don't throw — Google Sheets failure should not block the form submission
  }
}

export async function appendToSheetStrict(sheetName: string, values: string[][]): Promise<void> {
  if (!SPREADSHEET_ID) {
    throw new Error("GOOGLE_SHEETS_ID is not set");
  }

  const auth = getAuth();
  if (!auth) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set or invalid");
  }

  const sheets = google.sheets({ version: "v4", auth });
  await ensureSheetExists(sheets, SPREADSHEET_ID, sheetName);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: formatSheetRange(sheetName),
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });

  logger.info({ sheetName, rows: values.length }, "Appended rows to Google Sheets");
}
