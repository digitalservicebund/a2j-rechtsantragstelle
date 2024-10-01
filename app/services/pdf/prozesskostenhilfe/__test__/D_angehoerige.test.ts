import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { fillAngehoerige } from "~/services/pdf/prozesskostenhilfe/D_angehoerige";

let pdfParams: ProzesskostenhilfePDF;

describe("D_angehoerige", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });

  describe("fillAngehoerige", () => {
    it("should indicate if the user has a partner", () => {
      const { pdfValues } = fillAngehoerige({
        userData: {
          partnerschaft: "yes",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.verhaeltnis1.value).toBe("Ehepartner");
    });

    it("should print the partner's first and last name, if present", () => {
      let { pdfValues } = fillAngehoerige({
        userData: {
          partnerschaft: "yes",
          partnerVorname: "Max",
          partnerNachname: "Mustermann",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.angehoerigerNummereins.value).toBe("Max Mustermann");

      pdfParams = getProzesskostenhilfeParameters();
      ({ pdfValues } = fillAngehoerige({
        userData: {
          partnerschaft: "yes",
        },
        pdfValues: pdfParams,
      }));
      expect(pdfValues.angehoerigerNummereins.value).toBeUndefined();
    });

    it("should print the user's support obligation, if present", () => {
      const { pdfValues } = fillAngehoerige({
        userData: {
          partnerschaft: "yes",
          unterhalt: "yes",
          unterhaltsSumme: "100",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.monatsbetrag1.value).toBe("100 €");
    });

    it("should correctly indicate if the user's partner earns income", () => {
      let { pdfValues } = fillAngehoerige({
        userData: {
          partnerschaft: "yes",
          partnerEinkommen: "yes",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_4.value).toBe(true);

      ({ pdfValues } = fillAngehoerige({
        userData: {
          partnerschaft: "yes",
        },
        pdfValues: pdfParams,
      }));
      expect(pdfValues.eigeneEinnahmen1.value).toBe(true);
    });
  });
});
