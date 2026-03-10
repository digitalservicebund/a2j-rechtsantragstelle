import { readFile } from "node:fs/promises";
import path from "node:path";

// See scripts/streetNames/postProcess.ts
type StreetData = {
  name: string;
  locality: string;
};
type StreetNamesMap = Record<string, StreetData[]>;

const JSON_FILE_PATH = "data/streetNames.json";
let streetNamesMap: StreetNamesMap | undefined = undefined;

async function loadStreetNamesMap() {
  if (!streetNamesMap) {
    const jsonFilePath = path.resolve(path.join(process.cwd(), JSON_FILE_PATH));
    streetNamesMap = JSON.parse(await readFile(jsonFilePath, "utf8"));
  }
  return streetNamesMap as StreetNamesMap;
}

export async function streetNamesForZipcode(
  zipCode?: string,
): Promise<StreetData[]> {
  if (!zipCode) return [];
  return (await loadStreetNamesMap())[zipCode] ?? [];
}
