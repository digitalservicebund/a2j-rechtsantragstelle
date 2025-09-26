import { beratungshilfePersoenlicheDatenDone } from "~/domains/beratungshilfe/formular/persoenlicheDaten/doneFunctions";
import { type BeratungshilfePersoenlicheDatenUserData } from "~/domains/beratungshilfe/formular/persoenlicheDaten/userData";
import { dropEachProperty } from "~/util/objects";

describe("beratungshilfePersoenlicheDatenDone", () => {
  const validContext: BeratungshilfePersoenlicheDatenUserData & {
    geburtsdatum: {
      geburtsdatumTag: string;
      geburtsdatumMonat: string;
      geburtsdatumJahr: string;
    };
  } = {
    vorname: "A",
    nachname: "B",
    geburtsdatum: {
      geburtsdatumTag: "01",
      geburtsdatumMonat: "01",
      geburtsdatumJahr: "2021",
    },
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
