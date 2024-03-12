/**
 * @jest-environment node
 */

import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import {
  createAttachment,
  newPageHint,
} from "~/services/pdf/beratungshilfe/attachment";
import {
  fillFinancialBankkonto,
  fillFinancialGrundeigentum,
  fillFinancialKraftfahrzeug,
  fillFinancialWertsachen,
} from "~/services/pdf/beratungshilfe/sections/F_besitz";

describe("F_besitz", () => {
  describe("fillFinancialBankkonto", () => {
    it("should fill one bankkonto when context has one bankkonto is given", async () => {
      const context: BeratungshilfeFormularContext = {
        bankkonten: [
          {
            kontoEigentuemer: "myself",
            kontostand: "1000",
            bankName: "Bank1",
            iban: "DE123456789",
          },
        ],
      };
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

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

    it("should fill multiple bankkonto when context has multiple bankkonto is given", async () => {
      const context: BeratungshilfeFormularContext = {
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
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

      fillFinancialBankkonto(attachment, pdfFields, context);

      expect(pdfFields.f1Konten1.value).toBe(false);
      expect(pdfFields.f1Konten2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(false);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f3Bank1.value).toBe("Bitte im Anhang prüfen");
      expect(pdfFields.f4Kontostand.value).toBe(undefined);

      const bankkontenattachment = attachment.descriptions.find(
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
    it("should fill grundeigentum bewohnt pdf field when grundeigentum bewohnt is given in context", async () => {
      const context: BeratungshilfeFormularContext = {
        grundeigentumBewohnt: [
          {
            eigentuemer: "myself",
            art: "houseForFamily",
            flaeche: "100",
            verkaufswert: "100000",
          },
        ],
      };
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

      fillFinancialGrundeigentum(attachment, pdfFields, context);

      expect(pdfFields.f5Grundeigentum1.value).toBe(false);
      expect(pdfFields.f5Grundeigentum2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(true);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f7Nutzungsart.value).toBe(
        "Art des Eigentums: Haus für Familie, Eigentümer:in: Ich alleine, Fläche: 100 m²",
      );
      expect(pdfFields.f8Verkehrswert.value).toBe("100000 €");
    });

    it("should fill grundeigentum pdf field when grundeigentum is given in context", async () => {
      const context: BeratungshilfeFormularContext = {
        grundeigentum: [
          {
            eigentuemer: "myself",
            art: "houseForFamily",
            flaeche: "100",
            verkaufswert: "100000",
            land: "Deutschland",
            ort: "Berlin",
            plz: "12345",
            strassehausnummer: "Musterstraße 1",
          },
        ],
      };
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

      fillFinancialGrundeigentum(attachment, pdfFields, context);

      expect(pdfFields.f5Grundeigentum1.value).toBe(false);
      expect(pdfFields.f5Grundeigentum2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(true);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f7Nutzungsart.value).toBe(
        "Art des Eigentums: Haus für Familie, Eigentümer:in: Ich alleine, Fläche: 100 m²",
      );
    });

    it("should create attachment when grundeigentum and grundegentum bewohnt is given in context", async () => {
      const context: BeratungshilfeFormularContext = {
        grundeigentum: [
          {
            eigentuemer: "myself",
            art: "apartment",
            flaeche: "100",
            verkaufswert: "100001",
            land: "Deutschland",
            ort: "Berlin",
            plz: "12345",
            strassehausnummer: "Musterstraße 1",
          },
        ],
        grundeigentumBewohnt: [
          {
            eigentuemer: "myself",
            art: "hereditaryBuildingLaw",
            flaeche: "100",
            verkaufswert: "100002",
          },
        ],
      };
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

      fillFinancialGrundeigentum(attachment, pdfFields, context);

      expect(attachment.shouldCreateAttachment).toBe(true);
      expect(attachment.descriptions[0]).toEqual({
        title: "Grundeigentum",
        text:
          "Art des Eigentums: Wohnung\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100001 €\n" +
          "\n" +
          "Art des Eigentums: Erbbaurecht\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100002 €",
      });

      expect(pdfFields.f5Grundeigentum1.value).toBe(false);
      expect(pdfFields.f5Grundeigentum2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(false);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f7Nutzungsart.value).toBe(newPageHint);
    });

    it("should create attachment when multiple grundeigentum and grundeigentum bewohnt is given in context", async () => {
      const context: BeratungshilfeFormularContext = {
        grundeigentum: [
          {
            eigentuemer: "myself",
            art: "apartment",
            flaeche: "100",
            verkaufswert: "100001",
            land: "Deutschland",
            ort: "Berlin",
            plz: "12345",
            strassehausnummer: "Musterstraße 1",
          },
          {
            eigentuemer: "partner",
            art: "houseForFamily",
            flaeche: "100",
            verkaufswert: "100002",
            land: "Deutschland",
            ort: "Berlin",
            plz: "12345",
            strassehausnummer: "Musterstraße 1",
          },
        ],
        grundeigentumBewohnt: [
          {
            eigentuemer: "myself",
            art: "hereditaryBuildingLaw",
            flaeche: "100",
            verkaufswert: "100003",
          },
          {
            eigentuemer: "partner",
            art: "property",
            flaeche: "100",
            verkaufswert: "100004",
          },
        ],
      };
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

      fillFinancialGrundeigentum(attachment, pdfFields, context);

      expect(attachment.shouldCreateAttachment).toBe(true);
      expect(attachment.descriptions[0]).toEqual({
        title: "Grundeigentum",
        text:
          "Art des Eigentums: Wohnung\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100001 €\n" +
          "\n" +
          "Art des Eigentums: Haus für Familie\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100002 €\n" +
          "\n" +
          "Art des Eigentums: Erbbaurecht\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100003 €\n" +
          "\n" +
          "Art des Eigentums: Grundstück\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100004 €",
      });

      expect(pdfFields.f5Grundeigentum1.value).toBe(false);
      expect(pdfFields.f5Grundeigentum2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(false);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f7Nutzungsart.value).toBe(newPageHint);
    });
  });

  describe("fillFinancialKraftfahrzeug", () => {
    it("should fill kraftfahrzeug pdf field when kraftfahrzeug is given in context", async () => {
      const context: BeratungshilfeFormularContext = {
        kraftfahrzeuge: [
          {
            eigentuemer: "partner",
            art: "P 50",
            marke: "Trabant",
            anschaffungsjahr: "1985",
            arbeitsweg: "on",
            baujahr: "1990",
            bemerkung: "Bemerkung",
            kilometerstand: "999999",
            verkaufswert: "100000",
          },
        ],
      };
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

      fillFinancialKraftfahrzeug(attachment, pdfFields, context);

      expect(pdfFields.f9Kraftfahrzeug1.value).toBe(false);
      expect(pdfFields.f9Kraftfahrzeuge2.value).toBe(true);
      expect(pdfFields.f10KraftfahrzeugeA.value).toBe(false);
      expect(pdfFields.f10KraftfahrzeugB.value).toBe(true);
      expect(pdfFields.f10KraftfahrzeugC.value).toBe(false);
      expect(pdfFields.f11Fahrzeugart.value).toBe(
        "P 50, Trabant, Baujahr: 1990, km-Stand: 999999, Wird für den Arbeitsweg gebraucht",
      );
      expect(pdfFields.f12Verkehrswert.value).toBe("100000");

      expect(attachment.shouldCreateAttachment).toBe(false);
    });

    it("should fill multiple kraftfahrzeug pdf field when kraftfahrzeug is given in context", async () => {
      const context: BeratungshilfeFormularContext = {
        kraftfahrzeuge: [
          {
            eigentuemer: "partner",
            art: "P 50",
            marke: "Trabant",
            anschaffungsjahr: "1985",
            arbeitsweg: "on",
            baujahr: "1990",
            bemerkung: "Bemerkung",
            kilometerstand: "999999",
            verkaufswert: "100000",
          },
          {
            eigentuemer: "myself",
            art: "P 40",
            marke: "Trabbi",
            anschaffungsjahr: "1995",
            arbeitsweg: "on",
            baujahr: "1988",
            bemerkung: "Bemerkung 2",
            kilometerstand: "99999",
            verkaufswert: "10000",
          },
        ],
      };
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

      fillFinancialKraftfahrzeug(attachment, pdfFields, context);

      expect(pdfFields.f9Kraftfahrzeug1.value).toBe(false);
      expect(pdfFields.f9Kraftfahrzeuge2.value).toBe(true);
      expect(pdfFields.f10KraftfahrzeugeA.value).toBe(false);
      expect(pdfFields.f10KraftfahrzeugB.value).toBe(false);
      expect(pdfFields.f10KraftfahrzeugC.value).toBe(false);
      expect(pdfFields.f11Fahrzeugart.value).toBe(newPageHint);
      expect(pdfFields.f12Verkehrswert.value).toBe(undefined);

      expect(attachment.shouldCreateAttachment).toBe(true);
      expect(attachment.descriptions[0]).toEqual({
        title: "Kraftfahrzeuge",
        text:
          "Fahrzeug wird für den Arbeitsweg genutzt\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Art des Fahrzeugs: P 50\n" +
          "Marke: Trabant\n" +
          "Anschaffungsjahr: 1985\n" +
          "Baujahr: 1990\n" +
          "Kilometerstand (ca.): 999999 km\n" +
          "Verkehrswert: 100000 €\n" +
          "\n" +
          "Fahrzeug wird für den Arbeitsweg genutzt\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Art des Fahrzeugs: P 40\n" +
          "Marke: Trabbi\n" +
          "Anschaffungsjahr: 1995\n" +
          "Baujahr: 1988\n" +
          "Kilometerstand (ca.): 99999 km\n" +
          "Verkehrswert: 10000 €",
      });
    });
  });

  describe("fillFinancialWertsachen", () => {
    it("should fill wertsachen pdf field when wertsachen is given in context", async () => {
      const context: BeratungshilfeFormularContext = {
        wertsachen: [
          {
            eigentuemer: "partner",
            art: "valuableItem",
            wert: "100000",
          },
        ],
      };
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

      fillFinancialWertsachen(attachment, pdfFields, context);

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f14InhaberA.value).toBe(false);
      expect(pdfFields.f14InhaberB.value).toBe(true);
      expect(pdfFields.f14VermoegenswerteC.value).toBe(false);
      expect(pdfFields.f15Bezeichnung.value).toBe(
        "Wertgegenstand, Eigentümer:in: Ehe-Partner:in",
      );
      expect(pdfFields.f16RueckkaufswertoderVerkehrswertinEUR.value).toBe(
        "100000",
      );

      expect(attachment.shouldCreateAttachment).toBe(false);
    });

    it("should fill multiple wertsachen pdf field when wertsachen is given in context", async () => {
      const context: BeratungshilfeFormularContext = {
        wertsachen: [
          {
            eigentuemer: "partner",
            art: "valuableItem",
            wert: "100000",
          },
          {
            eigentuemer: "myself",
            art: "cash",
            wert: "10000",
          },
        ],
      };
      const pdfFields = await getBeratungshilfeParameters();
      const attachment = createAttachment(context);

      fillFinancialWertsachen(attachment, pdfFields, context);

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f14InhaberA.value).toBe(false);
      expect(pdfFields.f14InhaberB.value).toBe(false);
      expect(pdfFields.f14VermoegenswerteC.value).toBe(false);
      expect(pdfFields.f15Bezeichnung.value).toBe(newPageHint);
      expect(pdfFields.f16RueckkaufswertoderVerkehrswertinEUR.value).toBe(
        undefined,
      );

      expect(attachment.shouldCreateAttachment).toBe(true);

      expect(attachment.descriptions[0]).toEqual({
        title: "Wertsachen",
        text:
          "Wertgegenstand\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Verkehrswert: 100000 €\n" +
          "\n" +
          "Bargeld\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Verkehrswert: 10000 €",
      });
    });
  });
});
