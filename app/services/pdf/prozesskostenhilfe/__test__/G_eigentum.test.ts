import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/beratungshilfe/sections/E_unterhalt";
import {
  fillBankkonto,
  fillGrundeigentum,
} from "~/services/pdf/prozesskostenhilfe/G_eigentum";

let pdfParams: ProzesskostenhilfePDF;

describe("G_eigentum", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });
  describe("fillBankkonto", () => {
    it("should indicate if the user has a bank account", () => {
      let { pdfValues } = fillBankkonto({
        userData: {
          hasBankkonto: "yes",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_36.value).toBe(true);
      ({ pdfValues } = fillBankkonto({
        userData: {
          hasBankkonto: "no",
        },
        pdfValues: pdfParams,
      }));
      expect(pdfValues.nein_37.value).toBe(true);
      expect(
        pdfValues.artdesKontosKontoinhaberKreditinstitut.value,
      ).toBeUndefined();
    });

    it("should print a user's bank account when there is only one", () => {
      const { pdfValues } = fillBankkonto({
        userData: {
          hasBankkonto: "yes",
          bankkonten: [
            {
              bankName: "My Bank",
              iban: "DE12345678901234567890",
              kontoDescription: "My Bank Account",
              kontostand: "100",
              kontoEigentuemer: "partner",
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.artdesKontosKontoinhaberKreditinstitut.value).toBe(
        "Bank: My Bank, Inhaber: Ehe-Partner:in, Bezeichnung: My Bank Account, IBAN: DE12345678901234567890",
      );
    });

    it("should attach >1 bank accounts to an attachment", () => {
      const { pdfValues, attachment } = fillBankkonto({
        userData: {
          hasBankkonto: "yes",
          bankkonten: [
            {
              bankName: "My Bank",
              iban: "DE12345678901234567890",
              kontoDescription: "My Bank Account",
              kontostand: "100",
              kontoEigentuemer: "partner",
            },
            {
              bankName: "My Bank",
              iban: "DE12345678901234567890",
              kontoDescription: "My Bank Account",
              kontostand: "100",
              kontoEigentuemer: "partner",
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.artdesKontosKontoinhaberKreditinstitut.value).toBe(
        SEE_IN_ATTACHMENT_DESCRIPTION,
      );
      expect(attachment?.length).toBeGreaterThan(0);
    });
  });

  describe("fillGrundeigentum", () => {
    it("should indicate if the user has grundeigentum", () => {
      let { pdfValues } = fillGrundeigentum({
        userData: {
          hasGrundeigentum: "yes",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_37.value).toBe(true);
      ({ pdfValues } = fillGrundeigentum({
        userData: {
          hasGrundeigentum: "no",
        },
        pdfValues: pdfParams,
      }));
      expect(pdfValues.nein_39.value).toBe(true);
      expect(
        pdfValues
          .groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten
          .value,
      ).toBeUndefined();
    });

    it("should print a user's grundeigentum when there is only one", () => {
      const { pdfValues } = fillGrundeigentum({
        userData: {
          hasGrundeigentum: "yes",
          grundeigentum: [
            {
              isBewohnt: "yes",
              art: "eigentumswohnung",
              eigentuemer: "myself",
              flaeche: "100",
              verkaufswert: "100000",
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(
        pdfValues
          .groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten
          .value,
      ).toBe("Art: Wohnung, Eigennutzung, Fläche: 100 m²");
      expect(pdfValues.verkehrswert.value).toBe("100000 €");
    });

    it("should attach >1 grundeigentum to an attachment", () => {
      const { pdfValues, attachment } = fillGrundeigentum({
        userData: {
          hasGrundeigentum: "yes",
          grundeigentum: [
            {
              isBewohnt: "yes",
              art: "eigentumswohnung",
              eigentuemer: "myself",
              flaeche: "100",
              verkaufswert: "100000",
            },
            {
              isBewohnt: "yes",
              art: "eigentumswohnung",
              eigentuemer: "myself",
              flaeche: "100",
              verkaufswert: "100000",
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(
        pdfValues
          .groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten
          .value,
      ).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);
      expect(attachment?.length).toBeGreaterThan(0);
    });
  });
});
