import uniqBy from "lodash/uniqBy";

export const OPENPLZ_URL = "https://openplzapi.org/de";
type OpenPLZResult = {
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

export function buildOpenPlzResultUrl(streetName: string, houseNumber: string) {
  /**
   * For the purposes of matching the user input to zuständiges gericht, we really only need the house number without ergänzung
   */
  const trimmedHouseNumber = new RegExp(/\d+/).exec(houseNumber)?.[0];
  return `${streetName
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replaceAll(/\s+/g, "_")}/${trimmedHouseNumber}`;
}
export async function fetchStreetnamesForZipcode(zipCode?: string) {
  const openPlzResponse = await fetch(
    OPENPLZ_URL + `/Streets?postalCode=${zipCode}&page=1&pageSize=50`,
  );
  if (!openPlzResponse.ok) {
    throw new Error(
      `OpenPLZ Error: ${openPlzResponse.status} ${openPlzResponse.statusText}`,
    );
  }
  const results: OpenPLZResult[] = await openPlzResponse.json();
  const numPages = parseInt(openPlzResponse.headers.get("x-total-pages") ?? "");
  if (numPages > 1) {
    const requests: Array<Promise<Response>> = [];
    for (let page = 2; page <= numPages; page++) {
      requests.push(
        fetch(
          OPENPLZ_URL +
            `/Streets?postalCode=${zipCode}&page=${page}&pageSize=50`,
        ),
      );
    }
    const responses = await Promise.all(requests);
    if (responses.some((response) => !response.ok)) {
      const failedRequest = responses.find((response) => !response.ok)!;
      throw new Error(
        `OpenPLZ Error: ${failedRequest.status} ${failedRequest.statusText}`,
      );
    }
    const newResults = (
      await Promise.all(
        responses.map(
          async (response) => (await response.json()) as OpenPLZResult[],
        ),
      )
    ).flat();
    results.push(...newResults);
  }
  return uniqBy(results, "name").map((result) => ({
    value: result.name.toLowerCase().replaceAll(/\s+/g, ""),
    label: result.name,
  }));
}
