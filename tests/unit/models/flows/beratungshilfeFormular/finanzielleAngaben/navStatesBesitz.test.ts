import {
  bankKontoDone,
  besitzDone,
  besitzZusammenfassungDone,
  geldanlagenDone,
  grundeigentumDone,
  kraftfahrzeugeDone,
  wertsachenDone,
} from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStatesBesitz";
import * as navStatesBesitz from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/navStatesBesitz";

describe("besitzDone", () => {
  it("passes with all fields no", () => {
    expect(
      besitzDone({
        context: {
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

  it("passes with all fields yes", () => {
    expect(
      besitzDone({
        context: {
          hasBankkonto: "yes",
          hasGeldanlage: "yes",
          hasGrundeigentum: "yes",
          hasKraftfahrzeug: "yes",
          hasWertsache: "yes",
          besitzTotalWorth: "more10000",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with one field missing", () => {
    expect(
      besitzDone({
        context: {
          hasBankkonto: "yes",
          hasGeldanlage: "yes",
          hasGrundeigentum: "yes",
          hasKraftfahrzeug: "yes",
          hasWertsache: "yes",
        },
      }),
    ).toBeFalsy();
  });

  it("fails with all fields missing", () => {
    expect(
      besitzDone({
        context: {},
      }),
    ).toBeFalsy();
  });
});

describe("bankKontoDone", () => {
  it("passes with bankkonto no", () => {
    expect(
      bankKontoDone({
        context: {
          hasBankkonto: "no",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with bankkonto yes but no bankkonten key given", () => {
    expect(
      bankKontoDone({
        context: {
          hasBankkonto: "yes",
        },
      }),
    ).toBeFalsy();
  });

  it("fails with bankkonto yes but bankkonten is undefined", () => {
    expect(
      bankKontoDone({
        context: {
          hasBankkonto: "yes",
          bankkonten: undefined,
        },
      }),
    ).toBeFalsy();
  });

  it("fails with bankkonto yes but bankkonten is empty list", () => {
    expect(
      bankKontoDone({
        context: {
          hasBankkonto: "yes",
          bankkonten: [],
        },
      }),
    ).toBeFalsy();
  });

  it("passes with bankkonto yes and bankkonten given", () => {
    expect(
      bankKontoDone({
        context: {
          hasBankkonto: "yes",
          bankkonten: [
            {
              bankName: "bank",
              kontostand: "200",
              iban: "iban",
              kontoEigentuemer: "myself",
            },
          ],
        },
      }),
    ).toBeTruthy();
  });

  it("fails with all fields missing", () => {
    expect(
      bankKontoDone({
        context: {},
      }),
    ).toBeFalsy();
  });
});

describe("geldanlagenDone", () => {
  it("passes with geldanlage no", () => {
    expect(
      geldanlagenDone({
        context: {
          hasGeldanlage: "no",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with geldanlage yes but no geldanlage key given", () => {
    expect(
      geldanlagenDone({
        context: {
          hasGeldanlage: "yes",
        },
      }),
    ).toBeFalsy();
  });

  it("passes with geldanlage yes but worth less10000", () => {
    expect(
      geldanlagenDone({
        context: {
          hasGeldanlage: "yes",
          besitzTotalWorth: "less10000",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with geldanlage yes but geldanlagen is undefined", () => {
    expect(
      geldanlagenDone({
        context: {
          hasGeldanlage: "yes",
          geldanlagen: undefined,
        },
      }),
    ).toBeFalsy();
  });

  it("fails with geldanlage yes but geldanlagen is empty list", () => {
    expect(
      geldanlagenDone({
        context: {
          hasGeldanlage: "yes",
          geldanlagen: [],
        },
      }),
    ).toBeFalsy();
  });

  it("passes with geldanlage yes and geldanlagen given", () => {
    expect(
      geldanlagenDone({
        context: {
          hasGeldanlage: "yes",
          geldanlagen: [
            {
              art: "bargeld",
              eigentuemer: "myself",
              wert: "203",
            },
          ],
        },
      }),
    ).toBeTruthy();
  });

  it("fails with all fields missing", () => {
    expect(
      geldanlagenDone({
        context: {},
      }),
    ).toBeFalsy();
  });
});

describe("grundeigentumDone", () => {
  it("passes with grundeigentum no", () => {
    expect(
      grundeigentumDone({
        context: {
          hasGrundeigentum: "no",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with grundeigentum yes but no grundeigentum key given", () => {
    expect(
      grundeigentumDone({
        context: {
          hasGrundeigentum: "yes",
        },
      }),
    ).toBeFalsy();
  });

  it("passes with grundeigentum yes but worth less10000", () => {
    expect(
      grundeigentumDone({
        context: {
          hasGrundeigentum: "yes",
          besitzTotalWorth: "less10000",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with grundeigentum yes but grundeigentum is undefined", () => {
    expect(
      grundeigentumDone({
        context: {
          hasGrundeigentum: "yes",
          grundeigentum: undefined,
        },
      }),
    ).toBeFalsy();
  });

  it("fails with grundeigentum yes but grundeigentum is empty list", () => {
    expect(
      grundeigentumDone({
        context: {
          hasGrundeigentum: "yes",
          grundeigentum: [],
        },
      }),
    ).toBeFalsy();
  });

  it("passes with grundeigentum yes and grundeigentum given", () => {
    expect(
      grundeigentumDone({
        context: {
          hasGrundeigentum: "yes",
          grundeigentum: [
            {
              isBewohnt: "yes",
              art: "einfamilienhaus",
              eigentuemer: "myself",
              flaeche: "120",
              verkaufswert: "10000",
              strassehausnummer: "strassehausnummer",
              plz: "12345",
              ort: "ort",
              land: "land",
            },
          ],
        },
      }),
    ).toBeTruthy();
  });

  it("fails with all fields missing", () => {
    expect(
      grundeigentumDone({
        context: {},
      }),
    ).toBeFalsy();
  });
});

describe("kraftfahrzeugeDone", () => {
  it("passes with kraftfahrzeuge no", () => {
    expect(
      kraftfahrzeugeDone({
        context: {
          hasKraftfahrzeug: "no",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with kraftfahrzeuge yes but no kraftfahrzeuge key given", () => {
    expect(
      kraftfahrzeugeDone({
        context: {
          hasKraftfahrzeug: "yes",
        },
      }),
    ).toBeFalsy();
  });

  it("passes with kraftfahrzeuge yes but worth less10000", () => {
    expect(
      kraftfahrzeugeDone({
        context: {
          hasKraftfahrzeug: "yes",
          besitzTotalWorth: "less10000",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with kraftfahrzeuge yes but kraftfahrzeuge is undefined", () => {
    expect(
      kraftfahrzeugeDone({
        context: {
          hasKraftfahrzeug: "yes",
          kraftfahrzeuge: undefined,
        },
      }),
    ).toBeFalsy();
  });

  it("fails with kraftfahrzeuge yes but kraftfahrzeuge is empty list", () => {
    expect(
      kraftfahrzeugeDone({
        context: {
          hasKraftfahrzeug: "yes",
          kraftfahrzeuge: [],
        },
      }),
    ).toBeFalsy();
  });

  it("passes with kraftfahrzeuge yes and kraftfahrzeuge given", () => {
    expect(
      kraftfahrzeugeDone({
        context: {
          hasKraftfahrzeug: "yes",
          kraftfahrzeuge: [
            {
              art: "art",
              marke: "marke",
              eigentuemer: "myself",
              verkaufswert: "2000",
              kilometerstand: "20000",
              anschaffungsjahr: "1990",
              baujahr: "1990",
              bemerkung: "bemerkung",
              hasArbeitsweg: "yes",
              wert: "under10000",
            },
          ],
        },
      }),
    ).toBeTruthy();
  });

  it("fails with all fields missing", () => {
    expect(
      kraftfahrzeugeDone({
        context: {},
      }),
    ).toBeFalsy();
  });
});

describe("wertsachenDone", () => {
  it("passes with wertsachen no", () => {
    expect(
      wertsachenDone({
        context: {
          hasWertsache: "no",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with wertsachen yes but no wertsachen key given", () => {
    expect(
      wertsachenDone({
        context: {
          hasWertsache: "yes",
        },
      }),
    ).toBeFalsy();
  });

  it("passes with wertsachen yes but worth less10000", () => {
    expect(
      wertsachenDone({
        context: {
          hasWertsache: "yes",
          besitzTotalWorth: "less10000",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with wertsachen yes but wertsachen is undefined", () => {
    expect(
      wertsachenDone({
        context: {
          hasWertsache: "yes",
          wertsachen: undefined,
        },
      }),
    ).toBeFalsy();
  });

  it("fails with wertsachen yes but wertsachen is empty list", () => {
    expect(
      wertsachenDone({
        context: {
          hasWertsache: "yes",
          wertsachen: [],
        },
      }),
    ).toBeFalsy();
  });

  it("passes with wertsachen yes and wertsachen given", () => {
    expect(
      wertsachenDone({
        context: {
          hasWertsache: "yes",
          wertsachen: [
            {
              art: "art",
              eigentuemer: "myself",
              wert: "20",
            },
          ],
        },
      }),
    ).toBeTruthy();
  });

  it("fails with all fields missing", () => {
    expect(
      wertsachenDone({
        context: {},
      }),
    ).toBeFalsy();
  });
});

describe("besitzZusammenfassungDone", () => {
  it("passes with all sub-flows done", () => {
    jest.spyOn(navStatesBesitz, "bankKontoDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "geldanlagenDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "grundeigentumDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "kraftfahrzeugeDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "wertsachenDone").mockReturnValue(true);

    expect(besitzZusammenfassungDone({ context: {} })).toBeTruthy();
  });

  it("fails with bankkonto not done", () => {
    jest.spyOn(navStatesBesitz, "bankKontoDone").mockReturnValue(false);
    jest.spyOn(navStatesBesitz, "geldanlagenDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "grundeigentumDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "kraftfahrzeugeDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "wertsachenDone").mockReturnValue(true);

    expect(besitzZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with geldanlagen not done", () => {
    jest.spyOn(navStatesBesitz, "bankKontoDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "geldanlagenDone").mockReturnValue(false);
    jest.spyOn(navStatesBesitz, "grundeigentumDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "kraftfahrzeugeDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "wertsachenDone").mockReturnValue(true);

    expect(besitzZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with grundeigentum not done", () => {
    jest.spyOn(navStatesBesitz, "bankKontoDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "geldanlagenDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "grundeigentumDone").mockReturnValue(false);
    jest.spyOn(navStatesBesitz, "kraftfahrzeugeDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "wertsachenDone").mockReturnValue(true);

    expect(besitzZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with kraftfahrzeug not done", () => {
    jest.spyOn(navStatesBesitz, "bankKontoDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "geldanlagenDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "grundeigentumDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "kraftfahrzeugeDone").mockReturnValue(false);
    jest.spyOn(navStatesBesitz, "wertsachenDone").mockReturnValue(true);

    expect(besitzZusammenfassungDone({ context: {} })).toBeFalsy();
  });

  it("fails with wertsachen not done", () => {
    jest.spyOn(navStatesBesitz, "bankKontoDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "geldanlagenDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "grundeigentumDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "kraftfahrzeugeDone").mockReturnValue(true);
    jest.spyOn(navStatesBesitz, "wertsachenDone").mockReturnValue(false);

    expect(besitzZusammenfassungDone({ context: {} })).toBeFalsy();
  });
});
