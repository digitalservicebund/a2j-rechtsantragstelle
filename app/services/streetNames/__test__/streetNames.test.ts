import { streetNamesForZipcode } from "../index";

describe("streetNamesForZipcode", () => {
  it("should return empty array without input", async () => {
    expect(await streetNamesForZipcode()).toStrictEqual([]);
  });

  it("should return empty array for invalid postcodes", async () => {
    expect(await streetNamesForZipcode("asd")).toStrictEqual([]);
  });

  it("should filter by unique results", async () => {
    // 27499 (Insel Neuwerk) has only two entries
    expect(await streetNamesForZipcode("27499")).toEqual([
      { city: "Hamburg", name: "Herrengarten", postalCode: "27499" },
      { city: "Hamburg", name: "Mittelweg", postalCode: "27499" },
    ]);
  });
});
