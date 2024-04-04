import { anwaltlicheVertretungDone } from "~/models/flows/beratungshilfeFormular/anwaltlicheVertretung/context";
import { beratungshilfeFinanzielleAngabeDone } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStates";
import {
  grundvoraussetzungDone,
  type BeratungshilfeGrundvoraussetzungen,
} from "~/models/flows/beratungshilfeFormular/grundvoraussetzung/context";
import { beratungshilfePersoenlicheDatenDone } from "~/models/flows/beratungshilfeFormular/persoenlicheDaten/context";
import { rechtsproblemDone } from "~/models/flows/beratungshilfeFormular/rechtsproblem/context";
import * as navStatesBesitz from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStatesBesitz";
import * as navStates from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStates";

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

describe("finanzielleAngabenDone", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("passes with only grundsicherung", () => {
    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: { staatlicheLeistungen: "grundsicherung" },
      }),
    ).toBeTruthy();
  });

  it("passes with asylbewerberleistungen", () => {
    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: { staatlicheLeistungen: "asylbewerberleistungen" },
      }),
    ).toBeTruthy();
  });

  it("fails with buergergeld and no info", () => {
    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: {
          staatlicheLeistungen: "buergergeld",
        },
      }),
    ).toBeFalsy();
  });

  it("passes with buergergeld and besitz done and besitzZusammenfassung done", () => {
    jest.spyOn(navStatesBesitz, "besitzDone").mockReturnValue(true);
    jest
      .spyOn(navStatesBesitz, "besitzZusammenfassungDone")
      .mockReturnValue(true);

    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: {
          staatlicheLeistungen: "buergergeld",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with buergergeld and besitz done but besitzZusammenfassung not done", () => {
    jest.spyOn(navStatesBesitz, "besitzDone").mockReturnValue(true);
    jest
      .spyOn(navStatesBesitz, "besitzZusammenfassungDone")
      .mockReturnValue(false);

    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: {
          staatlicheLeistungen: "buergergeld",
        },
      }),
    ).toBeFalsy();
  });

  it("fails with buergergeld and besitz not done but besitzZusammenfassung done", () => {
    jest.spyOn(navStatesBesitz, "besitzDone").mockReturnValue(false);
    jest
      .spyOn(navStatesBesitz, "besitzZusammenfassungDone")
      .mockReturnValue(true);

    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: {
          staatlicheLeistungen: "buergergeld",
        },
      }),
    ).toBeFalsy();
  });

  it("fails with staatlicheLeistungen keine and reduced info", () => {
    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: {
          staatlicheLeistungen: "keine",
          hasBankkonto: "no",
          hasGeldanlage: "no",
          hasGrundeigentum: "no",
          hasKraftfahrzeug: "no",
          hasWertsache: "no",
          besitzTotalWorth: "unsure",
        },
      }),
    ).toBeFalsy();
  });

  it("passes with staatlicheLeistungen keine and all subflows done", () => {
    jest.spyOn(navStates, "partnerDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "besitzDone").mockReturnValue(true);
    jest
      .spyOn(navStatesBesitz, "besitzZusammenfassungDone")
      .mockReturnValue(true);
    jest.spyOn(navStates, "einkommenDone").mockReturnValue(true);
    jest.spyOn(navStates, "wohnungDone").mockReturnValue(true);
    expect(
      beratungshilfeFinanzielleAngabeDone({
        context: {
          staatlicheLeistungen: "keine",
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
