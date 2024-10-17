/* eslint-disable sonarjs/no-duplicate-string */
import type { z } from "zod";
import type { beratungshilfeFinanzielleAngaben } from "~/flows/beratungshilfeFormular/finanzielleAngaben/context";
import { bankKontoDone } from "~/flows/shared/finanzielleAngaben/doneFunctions";
import {
  geldanlagenDone,
  grundeigentumDone,
  kraftfahrzeugeDone,
  wertsachenDone,
  eigentumDone,
  kinderDone,
  ausgabenDone,
  ausgabeDone,
} from "../doneFunctions";

const mockedCompleteAusgabe: z.infer<
  typeof beratungshilfeFinanzielleAngaben.ausgaben
>[0] = {
  art: "Art und Weise",
  zahlungsempfaenger: "Empfänger",
  beitrag: "100",
  hasZahlungsfrist: "no",
  zahlungsfrist: "",
};

describe("eigentumDone", () => {
  it("passes with all fields no", () => {
    expect(
      eigentumDone({
        context: {
          hasBankkonto: "no",
          hasGeldanlage: "no",
          hasGrundeigentum: "no",
          hasKraftfahrzeug: "no",
          hasWertsache: "no",
          eigentumTotalWorth: "unsure",
        },
      }),
    ).toBeTruthy();
  });

  it("passes with all fields yes", () => {
    expect(
      eigentumDone({
        context: {
          hasBankkonto: "yes",
          hasGeldanlage: "yes",
          hasGrundeigentum: "yes",
          hasKraftfahrzeug: "yes",
          hasWertsache: "yes",
          eigentumTotalWorth: "more10000",
        },
      }),
    ).toBeTruthy();
  });

  it("fails with one field missing", () => {
    expect(
      eigentumDone({
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
      eigentumDone({
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

describe("ausgabeDone", () => {
  it("should return false if the ausgabe is missing the art, zahlungsempfaenger, or beitrag field", () => {
    expect(ausgabeDone({ ...mockedCompleteAusgabe, art: undefined })).toBe(
      false,
    );
    expect(
      ausgabeDone({ ...mockedCompleteAusgabe, zahlungsempfaenger: undefined }),
    ).toBe(false);
    expect(ausgabeDone({ ...mockedCompleteAusgabe, beitrag: undefined })).toBe(
      false,
    );
  });

  it("should true if the user has completed the ausgabe and it doesn't have a deadline", () => {
    expect(
      ausgabeDone({ ...mockedCompleteAusgabe, hasZahlungsfrist: "no" }),
    ).toBe(true);
  });

  it("should return false if the user's ausgabe has a deadline that they haven't entered", () => {
    expect(
      ausgabeDone({
        ...mockedCompleteAusgabe,
        hasZahlungsfrist: "yes",
        zahlungsfrist: undefined,
      }),
    ).toBe(false);
  });
});

describe("ausgabenDone", () => {
  it("should return true if the user receives staatliche leistungen", () => {
    expect(
      ausgabenDone({
        context: { staatlicheLeistungen: "grundsicherung" },
      }),
    ).toBe(true);
    expect(
      ausgabenDone({
        context: { staatlicheLeistungen: "buergergeld" },
      }),
    ).toBe(true);
    expect(
      ausgabenDone({
        context: { staatlicheLeistungen: "asylbewerberleistungen" },
      }),
    ).toBe(true);
  });

  it("should return true if the user does not have ausgaben", () => {
    expect(
      ausgabenDone({
        context: { hasAusgaben: "no" },
      }),
    ).toBe(true);
  });

  it("should return true if the user has ausgaben and has entered them fully", () => {
    expect(
      ausgabenDone({
        context: { hasAusgaben: "yes" },
      }),
    ).toBe(false);
    expect(
      ausgabenDone({
        context: {
          hasAusgaben: "yes",
          ausgaben: [
            {
              art: "Art und Weise",
              zahlungsempfaenger: "Empfänger",
              beitrag: "100",
              hasZahlungsfrist: "yes",
              zahlungsfrist: "01.01.2025",
            },
          ],
        },
      }),
    ).toBe(true);
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
          eigentumTotalWorth: "less10000",
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
          eigentumTotalWorth: "less10000",
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

describe("kinderDone", () => {
  it("should return true if the user receives staatliche leistungen", () => {
    expect(
      kinderDone({
        context: { staatlicheLeistungen: "grundsicherung" },
      }),
    ).toBe(true);
    expect(
      kinderDone({
        context: { staatlicheLeistungen: "asylbewerberleistungen" },
      }),
    ).toBe(true);
    expect(
      kinderDone({
        context: { staatlicheLeistungen: "buergergeld" },
      }),
    ).toBe(true);
  });

  it("should return true if the user has no children", () => {
    expect(
      kinderDone({
        context: { hasKinder: "no" },
      }),
    ).toBe(true);
  });

  it("should return false if the user has incomplete children entered", () => {
    expect(
      kinderDone({
        context: { hasKinder: "yes" },
      }),
    ).toBe(false);
    expect(
      kinderDone({
        context: {
          hasKinder: "yes",
          kinder: [
            {
              vorname: "Kinder",
              nachname: "McKindery",
              geburtsdatum: "",
              wohnortBeiAntragsteller: "yes",
              eigeneEinnahmen: "yes",
              einnahmen: "",
              unterhalt: "yes",
              unterhaltsSumme: "",
            },
          ],
        },
      }),
    ).toBe(false);
  });

  it("should return true if the user a fully-entered child", () => {
    expect(
      kinderDone({
        context: {
          hasKinder: "yes",
          kinder: [
            {
              vorname: "Kinder",
              nachname: "McKindery",
              geburtsdatum: "2000-01-01",
              wohnortBeiAntragsteller: "yes",
              eigeneEinnahmen: "yes",
              einnahmen: "100",
              unterhalt: "yes",
              unterhaltsSumme: "100",
            },
          ],
        },
      }),
    ).toBe(true);
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
          eigentumTotalWorth: "less10000",
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
              kilometerstand: 20000,
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
          eigentumTotalWorth: "less10000",
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
