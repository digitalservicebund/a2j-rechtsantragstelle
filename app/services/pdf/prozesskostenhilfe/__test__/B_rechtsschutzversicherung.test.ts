import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { fillRechtsschutzversicherung } from "~/services/pdf/prozesskostenhilfe/B_rechtsschutzversicherung";

let pdfParams: ProzesskostenhilfePDF;

describe("B_rechtsschutzversicherung", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });

  describe("fillRechtsschutzversicherung", () => {
    it("should indicate if the user has neither RSV nor org coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsv: "no",
          hasRsvThroughOrg: "no",
        },
      });
      expect(pdfValues["1Nein"].value).toBe(true);
      expect(pdfValues.nein_3.value).toBe(true);
    });

    it("should indicate if the user has partial RSV coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsv: "yes",
          hasRsvCoverage: "partly",
        },
      });
      expect(pdfValues.ja.value).toBe(true);
      expect(pdfValues.hoehederKosten.value).toBe(
        "RSV: Teilweise Kostenübernahme (siehe Belege)",
      );
    });

    it("should indicate if the user has no RSV coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsv: "yes",
          hasRsvCoverage: "no",
        },
      });
      expect(pdfValues["1Nein"].value).toBe(true);
      expect(pdfValues.ja_2.value).toBe(true);
      expect(pdfValues.bezeichnungderVersicherung.value).toBe(
        "RSV: Ja (siehe Belege)",
      );
    });

    it("should indicate if the user has partial Org coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsvThroughOrg: "yes",
          hasOrgCoverage: "partly",
        },
      });
      expect(pdfValues.ja.value).toBe(true);
      expect(pdfValues.hoehederKosten.value).toBe(
        "Verein/Organisation: Teilweise Kostenübernahme (siehe Belege)",
      );
    });

    it("should indicate if the user has no Org coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsvThroughOrg: "yes",
          hasOrgCoverage: "no",
        },
      });
      expect(pdfValues["1Nein"].value).toBe(true);
      expect(pdfValues.ja_2.value).toBe(true);
      expect(pdfValues.bezeichnungderVersicherung.value).toBe(
        "Verein/Organisation: Ja (siehe Belege)",
      );
    });
  });
});
