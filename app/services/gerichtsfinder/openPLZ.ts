import { readFile } from "node:fs/promises";

// See scripts/streetNames/postProcess.ts
type StreetData = {
  name: string;
  locality: string;
};
type StreetNamesMap = Record<string, StreetData[]>;

const JSON_FILE_PATH = "../../../data/streetNames.json";
let streetNamesMap: StreetNamesMap | undefined = undefined;

async function getStreetNamesByPostcode() {
  if (!streetNamesMap) {
    const jsonFileUrl = new URL(JSON_FILE_PATH, import.meta.url);
    streetNamesMap = JSON.parse(await readFile(jsonFileUrl, "utf8"));
  }
  return streetNamesMap as StreetNamesMap;
}

export function buildOpenPlzResultUrl(streetName: string, houseNumber: string) {
  /**
   * For the purposes of matching the user input to zuständiges gericht, we really only need the house number without ergänzung
   */
  const trimmedHouseNumber = new RegExp(/\d+/).exec(houseNumber)?.[0];
  return `${streetName
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll(/\s+/g, "_")}/${trimmedHouseNumber}`;
}
export async function fetchStreetnamesForZipcode(
  zipCode?: string,
): Promise<StreetData[]> {
  if (!zipCode) return [];
  return (await getStreetNamesByPostcode())[zipCode] ?? [];
}
