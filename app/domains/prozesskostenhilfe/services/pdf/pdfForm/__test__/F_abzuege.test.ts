import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { fillSelfAbzuege } from "../F_abzuege";

let pdfParams: ProzesskostenhilfePDF;

describe("F_abzuege", () => {
  describe("fillSelfAbuege", () => {
    beforeEach(() => {
      pdfParams = getProzesskostenhilfeParameters();
    });

    it("should indicate if the user has selbständige Abzüge", () => {
      const { pdfValues } = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          selbststaendigAbzuege: "250",
        },
      });
      expect(
        pdfValues.monatlicheAbzuegeinEurodurchSteuernSolidaritaetszuschlag
          .value,
      ).toBe("250 €");
      expect(pdfValues.steuernSolidarzuschlag.value).toBe(
        "Abzüge zusammengerechnet",
      );
    });

    it("should indicate the way the user commutes to work, if relevant", () => {
      let { pdfValues } = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          arbeitsweg: "publicTransport",
          monatlicheOPNVKosten: "49",
        },
      });
      expect(
        pdfValues
          .fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzung
          .value,
      ).toBe("ÖPNV; Arbeitsadresse: siehe Anhang");
      expect(pdfValues.monatlicheAbzuegeinEurodurchFahrtkosten.value).toBe(
        "49 €",
      );

      ({ pdfValues } = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          arbeitsweg: "privateVehicle",
          arbeitsplatzEntfernung: 10,
        },
      }));
      expect(
        pdfValues
          .fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzung
          .value,
      ).toBe("KFZ; Arbeitsadresse: siehe Anhang");
      expect(pdfValues.monatlicheAbzuegeinEurodurchFahrtkosten.value).toBe(
        "10km",
      );
    });

    it("should add an attachment if the versicherung, arbeitsausgaben, or Arbeitsweg sections need one", () => {
      let { attachment } = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          arbeitsausgaben: [
            {
              beschreibung: "arbeit",
              betrag: "100",
              zahlungsfrequenz: "monthly",
            },
            {
              beschreibung: "arbeit_2",
              betrag: "200",
              zahlungsfrequenz: "quarterly",
            },
          ],
        },
      });

      expect(attachment?.at(0)).toEqual({ title: "F Abzüge", level: "h2" });
      ({ attachment } = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          arbeitsausgaben: [],
          versicherungen: [
            {
              art: "kfzVersicherung",
              beitrag: "100",
            },
            {
              art: "hausratsversicherung",
              beitrag: "50",
            },
          ],
        },
      }));

      expect(attachment?.at(0)).toEqual({ title: "F Abzüge", level: "h2" });

      ({ attachment } = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          arbeitsweg: "privateVehicle",
        },
      }));

      expect(attachment?.at(0)).toEqual({ title: "F Abzüge", level: "h2" });
    });
    it("should display the description with item value and frequency in Sonstige Werbungskosten", () => {
      const attachment = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          arbeitsausgaben: [
            {
              beschreibung: "Buch",
              betrag: "100",
              zahlungsfrequenz: "yearly",
            },
          ],
        },
      });
      expect(attachment.pdfValues.sozialversicherungsbeitraege.value).toBe(
        "Buch (100 € Jährlich)",
      );
    });
    it("should calculate one monthly Sonstige Werbungskosten correctly", () => {
      const attachment = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          arbeitsausgaben: [
            {
              beschreibung: "Buch",
              betrag: "100",
              zahlungsfrequenz: "yearly",
            },
          ],
        },
      });
      expect(
        attachment.pdfValues
          .monatlicheAbzuegeinEurodurchSozialversicherungsbeitraege.value,
      ).toBe("8,33 €");
    });
    it("should calculate multiple monthly Sonstige Werbungskosten correctly", () => {
      const attachment = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          arbeitsausgaben: [
            {
              beschreibung: "Buch",
              betrag: "75",
              zahlungsfrequenz: "yearly",
            },
            {
              beschreibung: "Workshop",
              betrag: "100",
              zahlungsfrequenz: "yearly",
            },
            {
              beschreibung: "Team Offsite",
              betrag: "200",
              zahlungsfrequenz: "yearly",
            },
          ],
        },
      });
      expect(
        attachment.pdfValues
          .monatlicheAbzuegeinEurodurchSozialversicherungsbeitraege.value,
      ).toBe("31,25 €");
    });
  });
});
