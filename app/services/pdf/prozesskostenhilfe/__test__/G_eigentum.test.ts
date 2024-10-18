import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/beratungshilfe/sections/E_unterhalt";
import { fillBankkonto } from "~/services/pdf/prozesskostenhilfe/G_eigentum";
import { arrayIsNonEmpty } from "~/util/array";

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

    it("should print a user's bank account in the attachment", () => {
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
          ],
        },
        pdfValues: pdfParams,
      });
      expect(arrayIsNonEmpty(attachment)).toBe(true);
      expect(pdfValues.artdesKontosKontoinhaberKreditinstitut.value).toBe(
        SEE_IN_ATTACHMENT_DESCRIPTION,
      );
    });
  });
});
