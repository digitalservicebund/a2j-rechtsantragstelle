import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getFullPlaintiffName } from "../getFullPlaintiffName";

describe("getFullPlaintiffName", () => {
  it("should return the full plaintiff name given the vorname and nachname", () => {
    const userData: FluggastrechtContext = {
      vorname: "Test",
      nachname: "Test",
    };

    const actual = getFullPlaintiffName(userData);

    expect(actual).toEqual("Test Test");
  });

  it("should return the full plaintiff name with capitalized vorname given the vorname lower case and nachname", () => {
    const userData: FluggastrechtContext = {
      vorname: "test",
      nachname: "Test",
    };

    const actual = getFullPlaintiffName(userData);

    expect(actual).toEqual("Test Test");
  });

  it("should return the full plaintiff name given the title, vorname and nachname", () => {
    const userData: FluggastrechtContext = {
      title: "dr",
      vorname: "Test",
      nachname: "Test",
    };

    const actual = getFullPlaintiffName(userData);

    expect(actual).toEqual("Dr. Test Test");
  });

  it("should return the full plaintiff name given the anrede, vorname and nachname", () => {
    const userData: FluggastrechtContext = {
      anrede: "Herr",
      vorname: "Test",
      nachname: "Test",
    };

    const actual = getFullPlaintiffName(userData);

    expect(actual).toEqual("Herr Test Test");
  });
});
