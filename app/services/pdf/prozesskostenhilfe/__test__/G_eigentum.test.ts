import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import {
  fillBankkonto,
  fillBargeldOderWertgegenstaende,
  fillGrundeigentum,
  fillKraftfahrzeuge,
  fillSonstigeVermoegenswerte,
} from "~/services/pdf/prozesskostenhilfe/G_eigentum";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../../attachment";

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

  describe("fillKraftfahrzeuge", () => {
    it("should indicate if the user has kraftfahrzeuge", () => {
      let { pdfValues } = fillKraftfahrzeuge({
        userData: {
          hasKraftfahrzeug: "yes",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_38.value).toBe(true);
      ({ pdfValues } = fillKraftfahrzeuge({
        userData: {
          hasKraftfahrzeug: "no",
        },
        pdfValues: pdfParams,
      }));
      expect(pdfValues.nein_41.value).toBe(true);
    });

    it("should print a user's Kraftfahrzeug when there is only one", () => {
      const { pdfValues } = fillKraftfahrzeuge({
        userData: {
          hasKraftfahrzeug: "yes",
          kraftfahrzeuge: [
            {
              art: "auto",
              hasArbeitsweg: "no",
              eigentuemer: "myself",
              marke: "Audi",
              baujahr: "2000",
              kilometerstand: 200000,
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_38.value).toBe(true);
      expect(
        pdfValues
          .markeTypBaujahrAnschaffungsjahrAlleinoderMiteigentumKilometerstand
          .value,
      ).toBe(
        "Wird nicht für Arbeitsweg gebraucht, Art: auto, Marke: Audi, Baujahr: 2000, Kilometerstand: 200000",
      );
    });

    it("should attach >1 Kraftfahrzeug to the anhang", () => {
      const { pdfValues, attachment } = fillKraftfahrzeuge({
        userData: {
          hasKraftfahrzeug: "yes",
          kraftfahrzeuge: [
            {
              art: "auto",
              hasArbeitsweg: "no",
              eigentuemer: "myself",
              marke: "Audi",
              baujahr: "2000",
              kilometerstand: 200000,
            },
            {
              art: "motorrad",
              hasArbeitsweg: "yes",
              eigentuemer: "partner",
              marke: "BMW",
              baujahr: "1996",
              kilometerstand: 120000,
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(
        pdfValues
          .markeTypBaujahrAnschaffungsjahrAlleinoderMiteigentumKilometerstand
          .value,
      ).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);
      expect(attachment?.length).toBeGreaterThan(0);
    });
  });

  describe("fillBargeldOderWertgegenstaende", () => {
    it("should indicate if the user has bargeld or wertgegenstaende", () => {
      let { pdfValues } = fillBargeldOderWertgegenstaende({
        userData: {
          hasWertsache: "yes",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_39.value).toBe(true);
      ({ pdfValues } = fillBargeldOderWertgegenstaende({
        userData: {
          hasGeldanlage: "yes",
        },
        pdfValues: pdfParams,
      }));
      expect(pdfValues.ja_39.value).toBe(true);
    });

    it("should print either a single Bargeld entry, or a single Wertstaende entry, if present", () => {
      let { pdfValues } = fillBargeldOderWertgegenstaende({
        userData: {
          hasWertsache: "yes",
          wertsachen: [
            {
              art: "Kandelaber",
              eigentuemer: "myselfAndPartner",
              wert: "10000",
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_39.value).toBe(true);
      expect(
        pdfValues
          .bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum
          .value,
      ).toBe("Art: Kandelaber");
      expect(pdfValues.verkehrswert3.value).toBe("10000 €");

      ({ pdfValues } = fillBargeldOderWertgegenstaende({
        userData: {
          hasGeldanlage: "yes",
          geldanlagen: [
            {
              art: "bargeld",
              eigentuemer: "myselfAndPartner",
              wert: "1000",
            },
          ],
        },
        pdfValues: pdfParams,
      }));
      expect(pdfValues.ja_39.value).toBe(true);
      expect(
        pdfValues
          .bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum
          .value,
      ).toBe("Art: Bargeld");
      expect(pdfValues.verkehrswert3.value).toBe("1000 €");
    });

    it("should print the remaining bargeld/wertgegenstaende in the anhang", () => {
      const { pdfValues, attachment } = fillBargeldOderWertgegenstaende({
        userData: {
          hasGeldanlage: "yes",
          hasWertsache: "yes",
          wertsachen: [
            {
              art: "Bild",
              eigentuemer: "myselfAndPartner",
              wert: "1000000",
            },
          ],
          geldanlagen: [
            {
              art: "bargeld",
              eigentuemer: "myselfAndPartner",
              wert: "1000",
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(
        pdfValues
          .bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum
          .value,
      ).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);
      expect(attachment?.length).toBeGreaterThan(0);
    });
  });

  describe("fillSonstigeVermoegenswerte", () => {
    it("should indicate if the user has sonstige vermoegenswerte", () => {
      let { pdfValues } = fillSonstigeVermoegenswerte({
        userData: {
          geldanlagen: [
            {
              art: "befristet",
              eigentuemer: "myselfAndPartner",
              wert: "1000",
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.bezeichnungAlleinoderMiteigentum.value).toBe(
        "Art: Befristete Geldanlage",
      );
      expect(pdfValues.verkehrswert4.value).toBe("1000 €");
      expect(pdfValues.ja_41.value).toBe(true);
      ({ pdfValues } = fillSonstigeVermoegenswerte({
        userData: {
          geldanlagen: [],
        },
        pdfValues: pdfParams,
      }));
      expect(pdfValues.nein_46.value).toBe(true);
    });

    it("should attach additional vermoegenswerte in the anlage", () => {
      const { pdfValues, attachment } = fillSonstigeVermoegenswerte({
        userData: {
          geldanlagen: [
            {
              art: "befristet",
              eigentuemer: "myselfAndPartner",
              wert: "1000",
            },
            {
              art: "forderung",
              eigentuemer: "myself",
              wert: "10000",
            },
          ],
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.bezeichnungAlleinoderMiteigentum.value).toBe(
        SEE_IN_ATTACHMENT_DESCRIPTION,
      );
      expect(attachment?.length).toBeGreaterThan(0);
    });
  });
});
