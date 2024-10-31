import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { fillSelfAbzuege } from "~/services/pdf/prozesskostenhilfe/F_abzuege";

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
      expect(pdfValues.monatlicheAbzuegeinEuro1.value).toBe("250 €");
      expect(pdfValues.steuernSolidaritaetszuschlag1.value).toBe(
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
      expect(pdfValues.steuernSolidaritaetszuschlag_2.value).toBe("ÖPNV");
      expect(pdfValues.monatlicheAbzuegeinEuro4.value).toBe("49 €");

      ({ pdfValues } = fillSelfAbzuege({
        pdfValues: pdfParams,
        userData: {
          arbeitsweg: "privateVehicle",
          arbeitsplatzEntfernung: 10,
        },
      }));
      expect(pdfValues.steuernSolidaritaetszuschlag_2.value).toBe("KFZ");
      expect(pdfValues.monatlicheAbzuegeinEuro4.value).toBe("10km");
    });

    it("should add an attachment if the versicherung or arbeitsausgaben sections need one", () => {
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
    });
  });
});
