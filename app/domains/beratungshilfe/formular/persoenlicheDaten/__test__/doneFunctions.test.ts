import { beratungshilfePersoenlicheDatenDone } from "~/domains/beratungshilfe/formular/persoenlicheDaten/doneFunctions";
import { dropEachProperty } from "~/util/objects";
import { type BeratungshilfePersoenlicheDatenUserData } from "../userData";

describe("beratungshilfePersoenlicheDatenDone", () => {
  const validContext: BeratungshilfePersoenlicheDatenUserData & {
    geburtsdatum: string;
  } = {
    vorname: "A",
    nachname: "B",
    geburtsdatum: "1234",
    street: "abc",
    houseNumber: "123",
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
