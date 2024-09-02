/* eslint-disable sonarjs/no-duplicate-string */

import { type BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { createAttachment, newPageHint } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import {
  fillFinancialBankkonto,
  fillFinancialGrundeigentum,
  fillFinancialWertsachen,
  fillGeldanlagen,
} from "~/services/pdf/beratungshilfe/sections/F_besitz/F_besitz";

describe("F_besitz", () => {
  describe("fillFinancialBankkonto", () => {
    it("should fill one bankkonto when context has one bankkonto is given", () => {
      const context: BeratungshilfeFormularContext = {
        hasBankkonto: "yes",
        bankkonten: [
          {
            kontoEigentuemer: "myself",
            kontostand: "1000",
            bankName: "Bank1",
            iban: "DE123456789",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillFinancialBankkonto(attachment, pdfFields, context);

      expect(pdfFields.f1Konten1.value).toBe(false);
      expect(pdfFields.f1Konten2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(true);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f3Bank1.value).toBe(
        "Bank: Bank1, Eigentümer:in: Ich alleine",
      );
      expect(pdfFields.f4Kontostand.value).toBe("1000 €");
    });

    it("should fill multiple bankkonto when context has multiple bankkonto is given", () => {
      const context: BeratungshilfeFormularContext = {
        hasBankkonto: "yes",
        bankkonten: [
          {
            kontoEigentuemer: "myself",
            kontostand: "2222",
            bankName: "Bank1",
            iban: "DE123456789",
          },
          {
            kontoEigentuemer: "partner",
            kontostand: "3333",
            bankName: "Bank2",
            iban: "DE234535467",
          },
          {
            kontoEigentuemer: "myselfAndPartner",
            kontostand: "4444",
            bankName: "Bank3",
            iban: "DE13425678",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillFinancialBankkonto(attachment, pdfFields, context);

      expect(pdfFields.f1Konten1.value).toBe(false);
      expect(pdfFields.f1Konten2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(undefined);
      expect(pdfFields.f2InhaberB.value).toBe(undefined);
      expect(pdfFields.f2InhaberC.value).toBe(undefined);
      expect(pdfFields.f3Bank1.value).toBe("Bitte im Anhang prüfen");
      expect(pdfFields.f4Kontostand.value).toBe(undefined);

      const bankkontenattachment = attachment.find(
        (d) => d.title === "Bankkonten",
      )?.text;

      expect(bankkontenattachment).toContain(
        "Bank: Bank1\nEigentümer:in: Ich alleine\nKontostand: 2222 €\n",
      );
      expect(bankkontenattachment).toContain(
        "Bank: Bank2\nEigentümer:in: Ehe-Partner:in\nKontostand: 3333 €\n",
      );
      expect(bankkontenattachment).toContain(
        "Bank: Bank3\nEigentümer:in: Mein:e Ehe-Partner:in und ich gemeinsam\nKontostand: 4444 €",
      );
    });
  });

  describe("fillFinancialGrundeigentum", () => {
    it("should fill grundeigentum pdf field when grundeigentum is given in context", () => {
      const context: BeratungshilfeFormularContext = {
        hasGrundeigentum: "yes",
        grundeigentum: [
          {
            eigentuemer: "myself",
            art: "einfamilienhaus",
            flaeche: "100",
            verkaufswert: "100000",
            land: "Deutschland",
            ort: "Berlin",
            plz: "12345",
            strassehausnummer: "Musterstraße 1",
            isBewohnt: "yes",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillFinancialGrundeigentum(attachment, pdfFields, context);

      expect(pdfFields.f5Grundeigentum1.value).toBe(false);
      expect(pdfFields.f5Grundeigentum2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(true);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f7Nutzungsart.value).toBe(
        "Art des Eigentums: Haus für Familie, Eigentümer:in: Ich alleine, Fläche: 100 m², Eigennutzung",
      );
    });

    it("should create attachment when multiple grundeigentum is given in context", () => {
      const context: BeratungshilfeFormularContext = {
        hasGrundeigentum: "yes",
        grundeigentum: [
          {
            eigentuemer: "myself",
            art: "eigentumswohnung",
            flaeche: "100",
            verkaufswert: "100001",
            land: "Deutschland",
            ort: "Berlin",
            plz: "12345",
            strassehausnummer: "Musterstraße 1",
            isBewohnt: "yes",
          },
          {
            eigentuemer: "partner",
            isBewohnt: "no",
            art: "einfamilienhaus",
            flaeche: "100",
            verkaufswert: "100002",
            land: "Deutschland",
            ort: "Berlin",
            plz: "12345",
            strassehausnummer: "Musterstraße 1",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillFinancialGrundeigentum(attachment, pdfFields, context);

      expect(attachment[0]).toEqual({
        title: "Grundeigentum",
        text:
          "Art des Eigentums: Wohnung\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100001 €\n" +
          "Eigennutzung\n" +
          "\n" +
          "Art des Eigentums: Haus für Familie\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100002 €",
      });

      expect(pdfFields.f5Grundeigentum1.value).toBe(false);
      expect(pdfFields.f5Grundeigentum2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(undefined);
      expect(pdfFields.f2InhaberB.value).toBe(undefined);
      expect(pdfFields.f2InhaberC.value).toBe(undefined);
      expect(pdfFields.f7Nutzungsart.value).toBe(newPageHint);
    });
  });

  describe("fillFinancialWertsachen", () => {
    it("should fill wertsachen pdf field when wertsachen is given in context", () => {
      const context: BeratungshilfeFormularContext = {
        hasWertsache: "yes",
        wertsachen: [
          {
            eigentuemer: "partner",
            art: "Teure Sache",
            wert: "100000",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillFinancialWertsachen(attachment, pdfFields, context);

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f14InhaberA.value).toBe(false);
      expect(pdfFields.f14InhaberB.value).toBe(true);
      expect(pdfFields.f14VermoegenswerteC.value).toBe(false);
      expect(pdfFields.f15Bezeichnung.value).toBe(
        "Teure Sache, Eigentümer:in: Ehe-Partner:in",
      );
      expect(pdfFields.f16RueckkaufswertoderVerkehrswertinEUR.value).toBe(
        "100000",
      );
    });

    it("should fill multiple wertsachen pdf field when wertsachen is given in context", () => {
      const context: BeratungshilfeFormularContext = {
        hasWertsache: "yes",
        wertsachen: [
          {
            eigentuemer: "partner",
            art: "Teure Sache",
            wert: "100000",
          },
          {
            eigentuemer: "myself",
            art: "Bargeld",
            wert: "10000",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillFinancialWertsachen(attachment, pdfFields, context);

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f14InhaberA.value).toBe(undefined);
      expect(pdfFields.f14InhaberB.value).toBe(undefined);
      expect(pdfFields.f14VermoegenswerteC.value).toBe(undefined);
      expect(pdfFields.f15Bezeichnung.value).toBe(newPageHint);
      expect(pdfFields.f16RueckkaufswertoderVerkehrswertinEUR.value).toBe(
        undefined,
      );

      expect(attachment[0]).toEqual({
        title: "Wertsachen",
        text:
          "Teure Sache\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Verkehrswert: 100000 €\n" +
          "\n" +
          "Bargeld\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Verkehrswert: 10000 €",
      });
    });
  });

  describe("fillGeldanlagen", () => {
    it("should create a attachment when at least one geldanlage is given in context", () => {
      const context: BeratungshilfeFormularContext = {
        geldanlagen: [
          {
            eigentuemer: "partner",
            art: "bargeld",
            wert: "100000",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillGeldanlagen(attachment, pdfFields, context);

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f15Bezeichnung.value).toBe(newPageHint);
      expect(attachment[0]).toEqual({
        title: "Geldanlagen",
        text:
          "\nGeldanlage 1\n" +
          "Art der Geldanlage: Bargeld\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Wert: 100000 €",
      });
    });

    it("should create a valid attachment when a girokonto geldanlage is given in context", () => {
      const context: BeratungshilfeFormularContext = {
        geldanlagen: [
          {
            eigentuemer: "partner",
            art: "giroTagesgeldSparkonto",
            wert: "1000",
            kontoBankName: "Bank",
            kontoIban: "12356789",
            kontoBezeichnung: "Bezeichnung",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillGeldanlagen(attachment, pdfFields, context);

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f15Bezeichnung.value).toBe(newPageHint);
      expect(attachment[0]).toEqual({
        title: "Geldanlagen",
        text:
          "\nGeldanlage 1\n" +
          "Art der Geldanlage: Girokonto / Tagesgeld / Sparkonto\n" +
          "Name der Bank: Bank\n" +
          "IBAN: 12356789\n" +
          "Bezeichnung: Bezeichnung\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Wert: 1000 €",
      });
    });

    it("should create a valid attachment when a befristete geldanlage is given in context", () => {
      const context: BeratungshilfeFormularContext = {
        geldanlagen: [
          {
            eigentuemer: "partner",
            art: "befristet",
            befristetArt: "lifeInsurance",
            wert: "1000",
            verwendungszweck: "Verwendung",
            auszahlungdatum: "12.12.1990",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillGeldanlagen(attachment, pdfFields, context);

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f15Bezeichnung.value).toBe(newPageHint);
      expect(attachment[0]).toEqual({
        title: "Geldanlagen",
        text:
          "\nGeldanlage 1\n" +
          "Art der Geldanlage: Befristete Geldanlage\n" +
          "Art der Befristung: Lebensversicherung\n" +
          "Verwendungszweck: Verwendung\n" +
          "Auszahlungstermin: 12.12.1990\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Wert: 1000 €",
      });
    });

    it("should create a valid attachment when a sonstiges geldanlage is given in context", () => {
      const context: BeratungshilfeFormularContext = {
        geldanlagen: [
          {
            eigentuemer: "partner",
            art: "sonstiges",
            wert: "1000",
            verwendungszweck: "Beschreibung",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillGeldanlagen(attachment, pdfFields, context);

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f15Bezeichnung.value).toBe(newPageHint);
      expect(attachment[0]).toEqual({
        title: "Geldanlagen",
        text:
          "\nGeldanlage 1\n" +
          "Art der Geldanlage: Sonstiges\n" +
          "Beschreibung: Beschreibung\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Wert: 1000 €",
      });
    });

    it("should not create a attachment when no geldanlage is given in context", () => {
      const context: BeratungshilfeFormularContext = {
        geldanlagen: [],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillGeldanlagen(attachment, pdfFields, context);

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(undefined);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(undefined);
      expect(pdfFields.f15Bezeichnung.value).toBe(undefined);
      expect(attachment.length).toBe(0);
    });
  });
});
