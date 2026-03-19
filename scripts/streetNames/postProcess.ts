// oxlint-disable no-console
import { parseFile } from "@fast-csv/parse";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

export type StreetData = {
  postalCode: string;
  name: string;
  city: string;
};

// We want to drop any row, where the streetName doesn't start with a letter or number
// ^      -> Start of string
// \p{L}  -> Any letter from any language (includes Ä, ß, Ć, İ, Š, etc.)
// \p{N}  -> Any numeric character
// /u     -> Enables Unicode mode (required for \p{})
const validStreetNameRegex = /^[\p{L}\p{N}]/u;
const outputPath = path.join(process.cwd(), "/data/streetNames.sqlite");

type Row = Record<string, any>;
const getTrimmedEntryOrNull = (row: Row, fieldName: string) =>
  typeof row[fieldName] === "string" ? row[fieldName].trim() : null;

export function buildStreetNamesDb(inputPath: string) {
  console.log(`Building sqlite db from ${inputPath}`);
  const db = new DatabaseSync(outputPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS streets (
      postalCode TEXT NOT NULL,
      name TEXT NOT NULL,
      city TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_postalCode ON streets(postalCode);
  `);

  const insertStmt = db.prepare(
    `INSERT INTO streets (postalCode, name, city) VALUES (?, ?, ?)`,
  );

  db.exec("BEGIN TRANSACTION");

  let parsedCount = 0;
  let insertedCount = 0;
  let skippedInvalidStreetNameCount = 0;
  let skippedDuplicates = 0;
  const seenRows = new Set<string>();
  console.log("Beginning parsing (this might take ~20s)...");
  console.time("Build time");

  parseFile(inputPath, { headers: true })
    .on("error", (error) => {
      db.exec("ROLLBACK");
      console.error("CSV Parsing Error:", error);
    })
    .on("data", (row: Row) => {
      parsedCount++;
      const name = getTrimmedEntryOrNull(row, "Name");
      const postalCode = getTrimmedEntryOrNull(row, "PostalCode");
      const city = getTrimmedEntryOrNull(row, "Locality");

      // Skip row if missing data or invalid streetName
      if (!name || !postalCode || !city) return;
      if (!validStreetNameRegex.test(name)) {
        skippedInvalidStreetNameCount++;
        return;
      }

      const rowFingerprint = `${postalCode}|${name}`;
      if (seenRows.has(rowFingerprint)) {
        skippedDuplicates++;
        return;
      }
      seenRows.add(rowFingerprint);

      insertStmt.run(postalCode, name, city);
      insertedCount++;
    })
    .on("end", () => {
      console.log("Committing...");
      db.exec("COMMIT");
      db.close();

      console.log("--- Build Complete ---");
      console.log(`Total rows parsed:   ${parsedCount}`);
      console.log(`Rows inserted:       ${insertedCount}`);
      console.log(
        `Skipped (invalid street name): ${skippedInvalidStreetNameCount}`,
      );
      console.log(`Skipped (duplicates): ${skippedDuplicates}`);
      console.timeEnd("Build time");
    });
}
