import { anwaltlicheVertretungDone } from "~/domains/beratungshilfe/formular/anwaltlicheVertretung/guards";
import { type BeratungshilfeGrundvoraussetzungenUserData } from "~/domains/beratungshilfe/formular/grundvoraussetzung/userData";
import { dropEachProperty } from "~/util/objects";
import { grundvoraussetzungDone } from "../grundvoraussetzung/grundvoraussetzungDone";
import { rechtsproblemDone } from "../rechtsproblem/rechtsproblemDone";
import { getMissingInformationStrings } from "../stringReplacements";

describe("grundvoraussetzungDone", () => {
  it("tests all relevant fields", () => {
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
    } satisfies BeratungshilfeGrundvoraussetzungenUserData;

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

describe("getMissingInformationStrings", () => {
  it("should not show kinderMissingInformation for buergergeld users", () => {
    const result = getMissingInformationStrings({
      staatlicheLeistungen: "buergergeld",
      hasKinder: undefined,
    });

    expect(result.kinderMissingInformation).toBeUndefined();
    expect(result.eigentumMissingInformation).toBeDefined(); // Should check eigentum
  });

  it("should not show any financial missing information for grundsicherung users", () => {
    const result = getMissingInformationStrings({
      staatlicheLeistungen: "grundsicherung",
      hasKinder: undefined,
    });

    expect(result.kinderMissingInformation).toBeUndefined();
    expect(result.partnerMissingInformation).toBeUndefined();
    expect(result.eigentumMissingInformation).toBeUndefined();
  });

  it("should not show any financial missing information for asylbewerberleistungen users", () => {
    const result = getMissingInformationStrings({
      staatlicheLeistungen: "asylbewerberleistungen",
      hasKinder: undefined,
    });

    expect(result.kinderMissingInformation).toBeUndefined();
    expect(result.partnerMissingInformation).toBeUndefined();
    expect(result.eigentumMissingInformation).toBeUndefined();
  });

  it("should show kinderMissingInformation for other users when children section not filled", () => {
    const result = getMissingInformationStrings({
      staatlicheLeistungen: "keine",
      hasKinder: undefined,
    });

    expect(result.kinderMissingInformation).toBe(true);
    expect(result.partnerMissingInformation).toBeDefined();
    expect(result.eigentumMissingInformation).toBeDefined();
  });
});
