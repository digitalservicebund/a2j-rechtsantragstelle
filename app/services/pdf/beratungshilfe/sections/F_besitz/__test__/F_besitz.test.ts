/* eslint-disable sonarjs/no-duplicate-string */

import { type BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { newPageHint } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import {
  fillFinancialBankkonto,
  fillFinancialGrundeigentum,
} from "~/services/pdf/beratungshilfe/sections/F_besitz/F_besitz";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { fillVermoegenswerte } from "../fillVermoegenswerte";

describe("F_besitz", () => {
  describe("fillFinancialBankkonto", () => {
    it("should fill one bankkonto when context has one bankkonto is given", () => {
      const userData: BeratungshilfeFormularContext = {
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
      const { pdfValues } = pdfFillReducer({
        userData,
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillFinancialBankkonto],
      });

      expect(pdfValues.f1Konten1.value).toBe(false);
      expect(pdfValues.f1Konten2.value).toBe(true);
      expect(pdfValues.f1InhaberA.value).toBe(true);
      expect(pdfValues.f2InhaberB.value).toBe(false);
      expect(pdfValues.f2InhaberC.value).toBe(false);
      expect(pdfValues.f3Bank1.value).toBe("Bank: Bank1\nIBAN: DE123456789");
      expect(pdfValues.f4Kontostand.value).toBe("1000 €");
    });

    it("should fill multiple bankkonto when context has multiple bankkonto is given", () => {
      const userData: BeratungshilfeFormularContext = {
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
      const { pdfValues, attachment } = pdfFillReducer({
        userData,
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillFinancialBankkonto],
      });

      expect(pdfValues.f1Konten1.value).toBe(false);
      expect(pdfValues.f1Konten2.value).toBe(true);
      expect(pdfValues.f1InhaberA.value).toBe(undefined);
      expect(pdfValues.f2InhaberB.value).toBe(undefined);
      expect(pdfValues.f2InhaberC.value).toBe(undefined);
      expect(pdfValues.f3Bank1.value).toBe("Bitte im Anhang prüfen");
      expect(pdfValues.f4Kontostand.value).toBe(undefined);

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
      const userData: BeratungshilfeFormularContext = {
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
      const { pdfValues } = pdfFillReducer({
        userData,
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillFinancialGrundeigentum],
      });

      expect(pdfValues.f5Grundeigentum1.value).toBe(false);
      expect(pdfValues.f5Grundeigentum2.value).toBe(true);
      expect(pdfValues.f6EigentuemerA.value).toBe(true);
      expect(pdfValues.f6EigentuemerB.value).toBe(false);
      expect(pdfValues.f6EigentuemerC.value).toBe(false);
      expect(pdfValues.f7Nutzungsart.value).toBe(
        "Art: Haus für Familie, Eigennutzung, Fläche: 100 m²",
      );
    });

    it("should create attachment when multiple grundeigentum is given in context", () => {
      const userData: BeratungshilfeFormularContext = {
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
      const { pdfValues, attachment } = pdfFillReducer({
        userData,
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillFinancialGrundeigentum],
      });

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

      expect(pdfValues.f5Grundeigentum1.value).toBe(false);
      expect(pdfValues.f5Grundeigentum2.value).toBe(true);
      expect(pdfValues.f1InhaberA.value).toBe(undefined);
      expect(pdfValues.f2InhaberB.value).toBe(undefined);
      expect(pdfValues.f2InhaberC.value).toBe(undefined);
      expect(pdfValues.f7Nutzungsart.value).toBe(newPageHint);
    });
  });

  describe("fillVermoegenswerte", () => {
    it("should fill pdf field when wertsachen is given in context", () => {
      const { pdfValues, attachment } = pdfFillReducer({
        userData: {
          wertsachen: [
            {
              eigentuemer: "partner",
              art: "Teure Sache",
              wert: "100000",
            },
          ],
        },
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillVermoegenswerte],
      });

      expect(pdfValues.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfValues.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfValues.f14InhaberA.value).toBe(false);
      expect(pdfValues.f14InhaberB.value).toBe(true);
      expect(pdfValues.f14VermoegenswerteC.value).toBe(false);
      expect(pdfValues.f15Bezeichnung.value).toBe("Teure Sache");
      expect(pdfValues.f16RueckkaufswertoderVerkehrswertinEUR.value).toBe(
        "100000",
      );
      expect(attachment.length).toBe(0);
    });
    it("should fill pdf field when geldanlage is given in context", () => {
      const { pdfValues, attachment } = pdfFillReducer({
        userData: {
          geldanlagen: [
            {
              eigentuemer: "partner",
              art: "bargeld",
              wert: "100000",
            },
          ],
        },
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillVermoegenswerte],
      });

      expect(pdfValues.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfValues.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfValues.f14InhaberA.value).toBe(false);
      expect(pdfValues.f14InhaberB.value).toBe(true);
      expect(pdfValues.f14VermoegenswerteC.value).toBe(false);
      expect(pdfValues.f15Bezeichnung.value).toBe("Art: Bargeld");
      expect(pdfValues.f16RueckkaufswertoderVerkehrswertinEUR.value).toBe(
        "100000",
      );
      expect(attachment.length).toBe(0);
    });

    it("should add attachment when multiple vermoegen is present", () => {
      const userData: BeratungshilfeFormularContext = {
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
      const { pdfValues, attachment } = pdfFillReducer({
        userData,
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillVermoegenswerte],
      });

      expect(pdfValues.f13Vermoegenswerte1.value).toBe(false);
      expect(pdfValues.f13Vermoegenswerte2.value).toBe(true);
      expect(pdfValues.f14InhaberA.value).toBe(undefined);
      expect(pdfValues.f14InhaberB.value).toBe(undefined);
      expect(pdfValues.f14VermoegenswerteC.value).toBe(undefined);
      expect(pdfValues.f15Bezeichnung.value).toBe(newPageHint);
      expect(pdfValues.f16RueckkaufswertoderVerkehrswertinEUR.value).toBe(
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
