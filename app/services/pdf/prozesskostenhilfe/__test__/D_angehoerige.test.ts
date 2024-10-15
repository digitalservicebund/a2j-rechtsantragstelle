import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { fillAngehoerige } from "~/services/pdf/prozesskostenhilfe/D_angehoerige";

let pdfParams: ProzesskostenhilfePDF;
const userData: ProzesskostenhilfeFormularContext = {
  partnerschaft: "yes",
  zusammenleben: "no",
  unterhalt: "yes",
  unterhaltsSumme: "100",
  partnerVorname: "Max",
  partnerNachname: "Mustermann",
};

describe("D_angehoerige", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });

  describe("fillAngehoerige", () => {
    it("should fill the Angehoerige section if the user has a partner they don't live with but pay support to", () => {
      const { pdfValues } = fillAngehoerige({
        userData,
        pdfValues: pdfParams,
      });
      expect(pdfValues.verhaeltnis1.value).toBe("Partner:in");
      expect(pdfValues.angehoerigerNummereins.value).toBe(
        "Max Mustermann, lebt getrennt",
      );
      expect(pdfValues.monatsbetrag1.value).toBe("100 €");
    });

    it("should skip the Angehoerige section if the user has no partner", () => {
      const { pdfValues } = fillAngehoerige({
        userData: {
          ...userData,
          partnerschaft: "no",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.verhaeltnis1.value).toBeUndefined();
      expect(pdfValues.angehoerigerNummereins.value).toBeUndefined();
      expect(pdfValues.monatsbetrag1.value).toBeUndefined();
    });

    it("should skip the Angehoerige section if the user lives with their partner", () => {
      const { pdfValues } = fillAngehoerige({
        userData: {
          ...userData,
          zusammenleben: "yes",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.verhaeltnis1.value).toBeUndefined();
      expect(pdfValues.angehoerigerNummereins.value).toBeUndefined();
      expect(pdfValues.monatsbetrag1.value).toBeUndefined();
    });

    it("should skip the Angehoerige section if the user does not pay support to their partner", () => {
      const { pdfValues } = fillAngehoerige({
        userData: {
          ...userData,
          unterhalt: "no",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.verhaeltnis1.value).toBeUndefined();
      expect(pdfValues.angehoerigerNummereins.value).toBeUndefined();
      expect(pdfValues.monatsbetrag1.value).toBeUndefined();
    });

    it("should skip the Angehoerige section if the user has not filled out the support amount", () => {
      const { pdfValues } = fillAngehoerige({
        userData: {
          ...userData,
          unterhaltsSumme: undefined,
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.verhaeltnis1.value).toBeUndefined();
      expect(pdfValues.angehoerigerNummereins.value).toBeUndefined();
      expect(pdfValues.monatsbetrag1.value).toBeUndefined();
    });

    it("should skip the Angehoerige section if the user has not filled out the partner's name", () => {
      const { pdfValues } = fillAngehoerige({
        userData: {
          ...userData,
          partnerVorname: undefined,
          partnerNachname: undefined,
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.verhaeltnis1.value).toBeUndefined();
      expect(pdfValues.angehoerigerNummereins.value).toBeUndefined();
      expect(pdfValues.monatsbetrag1.value).toBeUndefined();
    });
  });
});
