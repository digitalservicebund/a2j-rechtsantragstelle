import { persoenlicheDatenDone } from "~/flows/shared/persoenlicheDaten/doneFunctions";
import { dropEachProperty } from "~/util/objects";

describe("persoenlicheDatenDone", () => {
  const validContext = {
    vorname: "A",
    nachname: "B",
    geburtsdatum: "1234",
    strasseHausnummer: "abc",
    plz: "12345",
    ort: "ABC",
  };

  it("should return true when all required fields are present", () => {
    expect(persoenlicheDatenDone({ context: validContext })).toBeTruthy();
  });

  it("should return false when any required field is missing", () => {
    dropEachProperty(validContext).forEach((context) => {
      expect(persoenlicheDatenDone({ context })).toBeFalsy();
    });
  });
});
