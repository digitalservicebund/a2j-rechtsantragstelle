import { DatabaseSync, type StatementSync } from "node:sqlite";
import { arrayIsNonEmpty } from "~/util/array";

type StreetData = {
  postalCode: string;
  name: string;
  city: string;
};

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

export function getStreetsNameByZipCode(zipCode?: string): StreetData[] {
  return zipCode ? dbLookup(zipCode) : [];
}

export function getCityNameByZipCode(zipCode: string): string {
  const streets = dbLookup(zipCode);
  return arrayIsNonEmpty(streets) ? streets[0].city : "";
}
