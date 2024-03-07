import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import {
  createDescriptionField,
  newPageHint,
} from "~/services/pdf/beratungshilfe/descriptionField";
import {
  fillFinancialBankkonto,
  fillFinancialGrundeigentum,
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
      const descriptionField = createDescriptionField(context);

      fillFinancialBankkonto(descriptionField, pdfFields, context);

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
      const descriptionField = createDescriptionField(context);

      fillFinancialBankkonto(descriptionField, pdfFields, context);

      expect(pdfFields.f1Konten1.value).toBe(false);
      expect(pdfFields.f1Konten2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(false);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f3Bank1.value).toBe("Bitte im Anhang prüfen");
      expect(pdfFields.f4Kontostand.value).toBe(undefined);

      const bankkontenDescriptionField = descriptionField.descriptions.find(
        (d) => d.title === "Bankkonten",
      )?.text;

      expect(bankkontenDescriptionField).toContain(
        "Bank: Bank1\nEigentümer:in: Ich alleine\nKontostand: 2222 €\n",
      );
      expect(bankkontenDescriptionField).toContain(
        "Bank: Bank2\nEigentümer:in: Ehe-Partner:in\nKontostand: 3333 €\n",
      );
      expect(bankkontenDescriptionField).toContain(
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
      const descriptionField = createDescriptionField(context);

      fillFinancialGrundeigentum(descriptionField, pdfFields, context);

      expect(pdfFields.f5Grundeigentum1.value).toBe(false);
      expect(pdfFields.f5Grundeigentum2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(true);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f7Nutzungsart.value).toBe(
        "Art des Eigentums: Hauf für Familie, Eigentümer:in: Ich alleine",
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
      const descriptionField = createDescriptionField(context);

      fillFinancialGrundeigentum(descriptionField, pdfFields, context);

      expect(pdfFields.f5Grundeigentum1.value).toBe(false);
      expect(pdfFields.f5Grundeigentum2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(true);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f7Nutzungsart.value).toBe(
        "Art des Eigentums: Hauf für Familie, Eigentümer:in: Ich alleine, Fläche: 100 m²",
      );
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
      const descriptionField = createDescriptionField(context);

      fillFinancialGrundeigentum(descriptionField, pdfFields, context);

      console.log(descriptionField.descriptions);

      expect(descriptionField.shouldCreateAttachment).toBe(true);
      expect(descriptionField.descriptions[0]).toEqual({
        title: "Grundeigentum",
        text:
          "Art des Eigentums: Wohnung\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100001 €\n" +
          "\n" +
          "Art des Eigentums: Hauf für Familie\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
          "Fläche: 100 m²\n" +
          "Verkehrswert: 100002 €\n" +
          "\n" +
          "Art des Eigentums: Erbbaurecht\n" +
          "Eigentümer:in: Ich alleine\n" +
          "Verkehrswert: 100003 €\n" +
          "\n" +
          "Art des Eigentums: Grundstück\n" +
          "Eigentümer:in: Ehe-Partner:in\n" +
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
});
