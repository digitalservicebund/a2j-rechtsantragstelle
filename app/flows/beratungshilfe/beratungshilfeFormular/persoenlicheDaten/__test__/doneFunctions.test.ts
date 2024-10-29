import { beratungshilfePersoenlicheDatenDone } from "~/flows/beratungshilfe/beratungshilfeFormular/persoenlicheDaten/doneFunctions";
import { dropEachProperty } from "~/util/objects";

describe("beratungshilfePersoenlicheDatenDone", () => {
  const validContext = {
    vorname: "A",
    nachname: "B",
    geburtsdatum: "1234",
    strasseHausnummer: "abc",
    plz: "12345",
    ort: "ABC",
  };

  it("should return true when all required fields are present", () => {
    expect(
      beratungshilfePersoenlicheDatenDone({ context: validContext }),
    ).toBeTruthy();
  });

  it("should return false when any required field is missing", () => {
    dropEachProperty(validContext).forEach((context) => {
      expect(beratungshilfePersoenlicheDatenDone({ context })).toBeFalsy();
    });
  });
});
