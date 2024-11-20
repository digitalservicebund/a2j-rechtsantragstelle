import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { fillGrundvoraussetzungen } from "../grundvoraussetzungen";

let pdfParams: ProzesskostenhilfePDF;

describe("grundvoraussetzungen", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });

  describe("fillGrundvoraussetzungen", () => {
    it("should indicate if the user has provided a Gericht Name or Aktenzeichen for an existing PKH application", () => {
      const { pdfValues } = fillGrundvoraussetzungen({
        pdfValues: pdfParams,
        userData: {
          gerichtName: "AG Karlsruhe",
          aktenzeichen: "1 F 20/23",
        },
      });
      expect(pdfValues.bezeichnungOrtundGeschaeftsnummerdesGerichts.value).toBe(
        "AG Karlsruhe, 1 F 20/23",
      );
    });

    it("should leave the field blank if the user has not provided a Gericht Name or Aktenzeichen", () => {
      const { pdfValues } = fillGrundvoraussetzungen({
        pdfValues: pdfParams,
        userData: {},
      });
      expect(pdfValues.bezeichnungOrtundGeschaeftsnummerdesGerichts.value).toBe(
        "",
      );
    });
  });
});
