import { getCityNameByZipCode, getStreetsNameByZipCode } from "../index";

describe("getStreetsNameByZipCode", () => {
  it("should return empty array without input", () => {
    const actual = getStreetsNameByZipCode();

    expect(actual).toStrictEqual([]);
  });

  it("should return empty array for invalid postcodes", () => {
    const actual = getStreetsNameByZipCode("asd");
    expect(actual).toStrictEqual([]);
  });

  it("should filter by unique results", () => {
    // 27499 (Insel Neuwerk) has only two entries
    const actual = getStreetsNameByZipCode("27499");

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
