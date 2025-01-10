import { getFullPlaintiffName } from "../getFullPlaintiffName";

describe("getFullPlaintiffName", () => {
  it("should return the full plaintiff name given the vorname and nachname", () => {
    const actual = getFullPlaintiffName(undefined, undefined, "Test", "Test");

    expect(actual).toEqual("Test Test");
  });

  it("should return the full plaintiff name with capitalized vorname given the vorname lower case and nachname", () => {
    const actual = getFullPlaintiffName(undefined, undefined, "test", "Test");

    expect(actual).toEqual("Test Test");
  });

  it("should return the full plaintiff name given the title, vorname and nachname", () => {
    const actual = getFullPlaintiffName(undefined, "dr", "Test", "Test");

    expect(actual).toEqual("Dr. Test Test");
  });

  it("should return the full plaintiff name given the anrede, vorname and nachname", () => {
    const actual = getFullPlaintiffName("herr", undefined, "Test", "Test");

    expect(actual).toEqual("Herr Test Test");
  });

  it("should return the full plaintiff name without anrede if anrede is none, vorname and nachname", () => {
    const actual = getFullPlaintiffName("none", undefined, "Test", "Test");

    expect(actual).toEqual("Test Test");
  });
});
