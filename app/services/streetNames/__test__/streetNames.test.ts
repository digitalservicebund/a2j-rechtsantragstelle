import { getCityNameByZipCode, streetNamesForZipcode } from "../index";

describe("streetNamesForZipcode", () => {
  it("should return empty array without input", async () => {
    const actual = await streetNamesForZipcode();

    expect(actual).toStrictEqual([]);
  });

  it("should return empty array for invalid postcodes", async () => {
    const actual = await streetNamesForZipcode("asd");
    expect(actual).toStrictEqual([]);
  });

  it("should filter by unique results", async () => {
    // 27499 (Insel Neuwerk) has only two entries
    const actual = await streetNamesForZipcode("27499");

    expect(actual).toEqual([
      { city: "Hamburg", name: "Herrengarten", postalCode: "27499" },
      { city: "Hamburg", name: "Mittelweg", postalCode: "27499" },
    ]);
  });
});

describe("getCityNameByZipCode", () => {
  it("should return empty string without input", () => {
    const actual = getCityNameByZipCode("");

    expect(actual).toBe("");
  });

  it("should return empty string for invalid postcodes", () => {
    const actual = getCityNameByZipCode("asd");

    expect(actual).toBe("");
  });

  it("should return the city name for a valid postcode", () => {
    const actual = getCityNameByZipCode("27499");

    expect(actual).toBe("Hamburg");
  });
});
