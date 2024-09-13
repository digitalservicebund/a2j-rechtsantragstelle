/* eslint-disable sonarjs/no-duplicate-string */

import { type BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { createAttachment, newPageHint } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import {
  fillFinancialBankkonto,
  fillFinancialGrundeigentum,
} from "~/services/pdf/beratungshilfe/sections/F_besitz/F_besitz";
import { fillVermoegenswerte } from "../fillVermoegenswerte";

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
      expect(pdfFields.f3Bank1.value).toBe("Bank: Bank1");
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

      expect(attachment).toContainEqual({ title: "Bankkonten", level: "h3" });
      expect(attachment).toContainEqual({ title: "Bankkonto 3", level: "h4" });
      expect(attachment).toContainEqual({
        title: "Inhaber",
        text: "Ehe-Partner:in",
      });
      expect(attachment).toContainEqual({
        title: "Kontostand",
        text: "4444 €",
      });
      expect(attachment).toContainEqual({
        title: "Iban",
        text: "DE13425678",
      });
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
      expect(pdfFields.f6EigentuemerA.value).toBe(true);
      expect(pdfFields.f6EigentuemerB.value).toBe(false);
      expect(pdfFields.f6EigentuemerC.value).toBe(false);
      expect(pdfFields.f7Nutzungsart.value).toBe(
        "Art: Haus für Familie, Eigennutzung, Fläche: 100 m²",
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

      expect(attachment[0]).toEqual({ title: "Grundeigentum", level: "h3" });
      expect(attachment).toContainEqual({
        level: "h4",
        title: "Grundeigentum 1",
      });
      expect(attachment).toContainEqual({
        title: "Art",
        text: "Wohnung",
      });
      expect(attachment).toContainEqual({
        title: "Eigentümer:in",
        text: "Ich alleine",
      });
      expect(attachment).toContainEqual({
        title: "Fläche",
        text: "100 m²",
      });
      expect(attachment).toContainEqual({
        title: "Verkehrswert",
        text: "100001 €",
      });

      expect(pdfFields.f5Grundeigentum1.value).toBe(false);
      expect(pdfFields.f5Grundeigentum2.value).toBe(true);
      expect(pdfFields.f1InhaberA.value).toBe(undefined);
      expect(pdfFields.f2InhaberB.value).toBe(undefined);
      expect(pdfFields.f2InhaberC.value).toBe(undefined);
      expect(pdfFields.f7Nutzungsart.value).toBe(newPageHint);
    });
  });

  describe("fillVermoegenswerte", () => {
    it("should fill pdf field when wertsachen is given in context", () => {
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillVermoegenswerte(attachment, pdfFields, {
        wertsachen: [
          {
            eigentuemer: "partner",
            art: "Teure Sache",
            wert: "100000",
          },
        ],
      });

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f14InhaberA.value).toBe(false);
      expect(pdfFields.f14InhaberB.value).toBe(true);
      expect(pdfFields.f14VermoegenswerteC.value).toBe(false);
      expect(pdfFields.f15Bezeichnung.value).toBe("Teure Sache");
      expect(pdfFields.f16RueckkaufswertoderVerkehrswertinEUR.value).toBe(
        "100000",
      );
      expect(attachment.length).toBe(0);
    });
    it("should fill pdf field when geldanlage is given in context", () => {
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillVermoegenswerte(attachment, pdfFields, {
        geldanlagen: [
          {
            eigentuemer: "partner",
            art: "bargeld",
            wert: "100000",
          },
        ],
      });

      expect(pdfFields.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfFields.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfFields.f14InhaberA.value).toBe(false);
      expect(pdfFields.f14InhaberB.value).toBe(true);
      expect(pdfFields.f14VermoegenswerteC.value).toBe(false);
      expect(pdfFields.f15Bezeichnung.value).toBe("Art: Bargeld");
      expect(pdfFields.f16RueckkaufswertoderVerkehrswertinEUR.value).toBe(
        "100000",
      );
      expect(attachment.length).toBe(0);
    });

    it("should add attachment when multiple vermoegen is present", () => {
      const context: BeratungshilfeFormularContext = {
        wertsachen: [
          {
            eigentuemer: "myself",
            art: "Bargeld",
            wert: "10000",
          },
        ],
        geldanlagen: [
          {
            art: "befristet",
            eigentuemer: "myselfAndSomeoneElse",
            wert: "10000",
            auszahlungdatum: "01.01.2000",
            befristetArt: "fixedDepositAccount",
            forderung: "asd",
            kontoBankName: "bank",
            kontoBezeichnung: "bezeichnung",
            kontoIban: "13",
            verwendungszweck: "zweck",
          },
        ],
      };
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();

      fillVermoegenswerte(attachment, pdfFields, context);

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
        title: "Sonstige Vermögenswerte",
        level: "h3",
      });

      expect(attachment).toContainEqual({ level: "h4", title: "Geldanlage 1" });
      expect(attachment).toContainEqual({
        text: "Befristete Geldanlage",
        title: "Art",
      });
      expect(attachment).toContainEqual({ text: "10000", title: "Wert" });
      expect(attachment).toContainEqual({
        text: "Ich gemeinsam mit jemand anderem",
        title: "Eigentümer:in",
      });
      expect(attachment).toContainEqual({
        text: "01.01.2000",
        title: "Auszahlungsdatum",
      });
      expect(attachment).toContainEqual({
        text: "Festgeldkonto",
        title: "Art der Befristung",
      });
      expect(attachment).toContainEqual({ text: "asd", title: "Forderung" });
      expect(attachment).toContainEqual({
        text: "zweck",
        title: "Verwendungszweck",
      });
      expect(attachment).toContainEqual({
        text: "bank",
        title: "Name der Bank",
      });
      expect(attachment).toContainEqual({
        text: "bezeichnung",
        title: "Bezeichnung",
      });
      expect(attachment).toContainEqual({ text: "13", title: "IBAN" });
    });
  });
});
