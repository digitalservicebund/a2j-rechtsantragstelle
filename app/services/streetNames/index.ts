import { DatabaseSync, type StatementSync } from "node:sqlite";
import type { StreetData } from "scripts/streetNames/postProcess";

let dbLookupStatement: StatementSync | undefined = undefined;

function dbLookup(zipCode: string) {
  // cache dbLookupStatement so we only read the db & compile the statement once
  if (!dbLookupStatement) {
    const db = new DatabaseSync("data/streetNames.sqlite", { readOnly: true });
    dbLookupStatement = db.prepare(
      `SELECT postalCode, name, city FROM streets WHERE postalCode = ?`,
    );
  }
  return dbLookupStatement.all(zipCode) as StreetData[];
}

export async function streetNamesForZipcode(
  zipCode?: string,
): Promise<StreetData[]> {
  return zipCode ? dbLookup(zipCode) : [];
}
