import { anwaltlicheVertretungDone } from "~/flows/beratungshilfeFormular/anwaltlicheVertretung/guards";
import {
  grundvoraussetzungDone,
  type BeratungshilfeGrundvoraussetzungen,
} from "~/flows/beratungshilfeFormular/grundvoraussetzung/context";
import { beratungshilfePersoenlicheDatenDone } from "~/flows/beratungshilfeFormular/persoenlicheDaten/context";
import { rechtsproblemDone } from "~/flows/beratungshilfeFormular/rechtsproblem/context";

function dropEachProperty(context: object) {
  return Object.values(
    Object.keys(context).map((key) => {
      const { [key as keyof typeof context]: _, ...rest } = context;
      return rest;
    }),
  );
}

describe("grundvoraussetzungDone", () => {
  it("tests all revelant fields", () => {
    expect(
      grundvoraussetzungDone({
        context: {
          rechtsschutzversicherung: "no",
          wurdeVerklagt: "no",
          klageEingereicht: "no",
          beratungshilfeBeantragt: "no",
          eigeninitiativeGrundvorraussetzung: "no",
        },
      }),
    ).toBeTruthy();
  });

  it("fail if any property is missing", () => {
    const validContext = {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
    } satisfies BeratungshilfeGrundvoraussetzungen;

    dropEachProperty(validContext).forEach((context) => {
      expect(grundvoraussetzungDone({ context })).toBeFalsy();
    });
  });
});

describe("anwaltlicheVertretungDone", () => {
  it("passes with initial no", () => {
    expect(
      anwaltlicheVertretungDone({
        context: { anwaltskanzlei: "no" },
      }),
    ).toBeTruthy();
  });

  it("passes if no beratung", () => {
    expect(
      anwaltlicheVertretungDone({
        context: {
          anwaltskanzlei: "yes",
          beratungStattgefunden: "no",
        },
      }),
    ).toBeTruthy();
  });

  it("passes if beratung happened with all details", () => {
    expect(
      anwaltlicheVertretungDone({
        context: {
          anwaltskanzlei: "yes",
          beratungStattgefunden: "no",
          anwaltName: "abc",
          anwaltOrt: "abc",
          anwaltPlz: "12345",
          anwaltStrasseUndHausnummer: "abc 1",
        },
      }),
    ).toBeTruthy();
  });
});

describe("rechtsproblemDone", () => {
  it("passes with eigeninitiative", () => {
    expect(
      rechtsproblemDone({
        context: {
          gegenseite: "abc",
          beschreibung: "abc",
          bereich: "authorities",
          ziel: "abcd",
          eigeninitiativeBeschreibung: "text",
        },
      }),
    ).toBeTruthy();
  });
});

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
