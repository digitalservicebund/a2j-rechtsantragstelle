import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { DescriptionField } from "~/services/pdf/beratungshilfe/descriptionField";
import { fillFinancialBankkonto } from "~/services/pdf/beratungshilfe/sections/F_besitz";

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
      const descriptionField = new DescriptionField(context);

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
      const descriptionField = new DescriptionField(context);

      fillFinancialBankkonto(descriptionField, pdfFields, context);

      expect(pdfFields.f1Konten1.value).toBe(false);
      expect(pdfFields.f1Konten2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(false);
      expect(pdfFields.f2InhaberB.value).toBe(false);
      expect(pdfFields.f2InhaberC.value).toBe(false);
      expect(pdfFields.f3Bank1.value).toBe(undefined);
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
});
