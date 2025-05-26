import uniqBy from "lodash/uniqBy";

export const OPENPLZ_URL = "https://openplzapi.org/de";
export type OpenPLZResult = {
  name: string;
  postalCode: string;
  locality: string;
  borough: string;
  suburb: string;
  municipality: {
    key: string;
    name: string;
    type: string;
  };
  federalState: {
    key: string;
    name: string;
  };
};
export function buildOpenPlzResultUrl(streetName: string, houseNumber: number) {
  return `${streetName
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replaceAll(/\s+/g, "_")}/${houseNumber}`;
}
export async function fetchStreetnamesForZipcode(
  zipCode: string,
  searchTerm?: string,
  page = 1,
) {
  const queryString = searchTerm ? `name=^${searchTerm}&` : "";
  const openPlzResponse = await fetch(
    OPENPLZ_URL +
      `/Streets?${queryString}postalCode=${zipCode}&page=${page.toString()}&pageSize=50`,
  );
  if (!openPlzResponse.ok) {
    throw new Error(
      `OpenPLZ Error: ${openPlzResponse.status} ${openPlzResponse.statusText}`,
    );
  }
  return uniqBy((await openPlzResponse.json()) as OpenPLZResult[], "name");
}
