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
      anwaltskanzlei: "no",
      gegenseite: "test",
      beschreibung: "test",
      bereich: "authorities",
      ziel: "test",
      eigeninitiativeBeschreibung: "test",
      einkommen: "1000",
      vorname: "test",
      nachname: "test",
      geburtsdatum: { day: "01", month: "01", year: "1990" },
      hasBankkonto: "no",
      hasGeldanlage: "no",
      hasGrundeigentum: "no",
      hasKraftfahrzeug: "no",
      hasWertsache: "no",
    });

    expect("kinderMissingInformation" in result).toBe(false);
    expect("eigentumMissingInformation" in result).toBe(true);
    if ("eigentumMissingInformation" in result) {
      expect(result.eigentumMissingInformation).toBe(false);
    }
  });

  it("should not show any financial missing information for grundsicherung users", () => {
    const result = getMissingInformationStrings({
      staatlicheLeistungen: "grundsicherung",
      hasKinder: undefined,
      anwaltskanzlei: "no",
      gegenseite: "test",
      beschreibung: "test",
      bereich: "authorities",
      ziel: "test",
      eigeninitiativeBeschreibung: "test",
      einkommen: "1000",
      vorname: "test",
      nachname: "test",
      geburtsdatum: { day: "01", month: "01", year: "1990" },
    });

    expect("kinderMissingInformation" in result).toBe(false);
    expect("partnerMissingInformation" in result).toBe(false);
    expect("eigentumMissingInformation" in result).toBe(false);
  });

  it("should not show any financial missing information for asylbewerberleistungen users", () => {
    const result = getMissingInformationStrings({
      staatlicheLeistungen: "asylbewerberleistungen",
      hasKinder: undefined,
      anwaltskanzlei: "no",
      gegenseite: "test",
      beschreibung: "test",
      bereich: "authorities",
      ziel: "test",
      eigeninitiativeBeschreibung: "test",
      einkommen: "1000",
      vorname: "test",
      nachname: "test",
      geburtsdatum: { day: "01", month: "01", year: "1990" },
    });

    expect("kinderMissingInformation" in result).toBe(false);
    expect("partnerMissingInformation" in result).toBe(false);
    expect("eigentumMissingInformation" in result).toBe(false);
  });

  it("should show kinderMissingInformation for other users when children section not filled", () => {
    const result = getMissingInformationStrings({
      staatlicheLeistungen: "keine",
      hasKinder: undefined,
      anwaltskanzlei: "no",
      gegenseite: "test",
      beschreibung: "test",
      bereich: "authorities",
      ziel: "test",
      eigeninitiativeBeschreibung: "test",
      einkommen: "1000",
      vorname: "test",
      nachname: "test",
      geburtsdatum: { day: "01", month: "01", year: "1990" },
      partnerschaft: undefined,
      livingSituation: undefined,
    });

    expect("kinderMissingInformation" in result).toBe(true);
    expect("partnerMissingInformation" in result).toBe(true);
    expect("eigentumMissingInformation" in result).toBe(true);
    if ("kinderMissingInformation" in result) {
      expect(result.kinderMissingInformation).toBe(true);
    }
    if ("partnerMissingInformation" in result) {
      expect(result.partnerMissingInformation).toBe(true);
    }
    if ("eigentumMissingInformation" in result) {
      expect(result.eigentumMissingInformation).toBe(true);
    }
  });
});
