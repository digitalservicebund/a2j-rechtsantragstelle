import streetNamesByPostcode from "../../../data/streetNames.json";

// See scripts/streetNames/postProcess.ts
type StreetData = {
  name: string;
  locality: string;
};
type StreetNameMap = Record<string, StreetData[]>;

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
export function fetchStreetnamesForZipcode(zipCode?: string): StreetData[] {
  if (!zipCode) return [];
  return (streetNamesByPostcode as StreetNameMap)[zipCode] ?? [];
}
