import { beratungshilfePersoenlicheDatenDone } from "~/domains/beratungshilfe/formular/persoenlicheDaten/doneFunctions";
import { type PersoenlicheDatenUserData } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { dropEachProperty } from "~/util/objects";

describe("beratungshilfePersoenlicheDatenDone", () => {
  const validContext: PersoenlicheDatenUserData & { geburtsdatum: string } = {
    vorname: "A",
    nachname: "B",
    geburtsdatum: "1234",
    street: "abc",
    houseNumber: "123",
    plz: "12345",
    ort: "ABC",
    telefonnummer: "", // optional input but state should not be done before clicking next
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
