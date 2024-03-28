import { anwaltlicheVertretungDone } from "~/models/flows/beratungshilfeFormular/anwaltlicheVertretung/context";
import { beratungshilfeFinanzielleAngabeDone } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStates";
import {
  grundvoraussetzungDone,
  type BeratungshilfeGrundvoraussetzungen,
} from "~/models/flows/beratungshilfeFormular/grundvoraussetzung/context";
import { rechtsproblemDone } from "~/models/flows/beratungshilfeFormular/rechtsproblem/context";

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

    Object.keys(validContext).forEach((key) => {
      const { [key as keyof typeof validContext]: _, ...invalidContext } =
        validContext;
      expect(grundvoraussetzungDone({ context: invalidContext })).toBeFalsy();
      expect(
        grundvoraussetzungDone({ context: { ...validContext, [key]: "yes" } }),
      ).toBeFalsy();
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

describe("finanzielleAngabenDone", () => {
  test.skip("passes with only grundsicherung", () => {
    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: { staatlicheLeistungen: "grundsicherung" },
      }),
    ).toBeTruthy();
  });

  test.skip("passes with asylbewerberleistungen", () => {
    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: { staatlicheLeistungen: "asylbewerberleistungen" },
      }),
    ).toBeTruthy();
  });

  test.skip("passes with buergergeld and reduced info", () => {
    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: {
          staatlicheLeistungen: "buergergeld",
          hasBankkonto: "no",
          hasGeldanlage: "no",
          hasGrundeigentum: "no",
          hasKraftfahrzeug: "no",
          hasWertsache: "no",
          besitzTotalWorth: "unsure",
        },
      }),
    ).toBeTruthy();
  });
});
