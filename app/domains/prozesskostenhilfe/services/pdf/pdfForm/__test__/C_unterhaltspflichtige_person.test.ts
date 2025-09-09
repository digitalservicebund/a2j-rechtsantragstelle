import {
  getProzesskostenhilfeParameters,
  type ProzesskostenhilfePDF,
} from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import {
  fillUnterhaltsanspruch,
  unterhaltsAnspruchSonstigesAttachmentTitle,
} from "../C_unterhaltspflichtige_person";

let pdfParams: ProzesskostenhilfePDF;
const userData: ProzesskostenhilfeFormularUserData = {
  vorname: "Angelika",
  nachname: "M",
  unterhaltsanspruch: "unterhalt",
};

describe("C_unterhaltsanspruch", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });

  describe("fillUnterhaltsanspruch", () => {
    it("should fill the Name and Vorname and select correct checkbox", () => {
      const { pdfValues } = fillUnterhaltsanspruch({
        userData: {
          ...userData,
          unterhaltspflichtigePerson: {
            vorname: "unterhaltVor",
            nachname: "unterhaltNach",
            beziehung: "father",
          },
        },
        pdfValues: pdfParams,
      });

      expect(pdfValues.namedesUnterhaltspflichtigen.value).toBe(
        "unterhaltVor unterhaltNach, Vater",
      );
      expect(pdfValues.c2.value).toBeTruthy();
    });

    it('should attach to the Anhang if "sonstiges" Unterhaltsanspruch is indicated', () => {
      const { pdfValues, attachment } = fillUnterhaltsanspruch({
        userData: {
          unterhaltsanspruch: "sonstiges",
          unterhaltsbeschreibung: "Beschreibung",
        },
        pdfValues: pdfParams,
      });

      expect(pdfValues.e14.value).toBeUndefined();
      expect(pdfValues.c2.value).toBeUndefined();
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchUnterhaltinEuro.value,
      ).toBe("s. Anhang");
      expect(pdfValues.namedesUnterhaltspflichtigen.value).toBe("s. Anhang");
      expect(
        attachment?.some(
          (a) => a.title === unterhaltsAnspruchSonstigesAttachmentTitle,
        ),
      ).toBe(true);
    });

    it("should select correct checkbox if none is present", () => {
      const { pdfValues } = fillUnterhaltsanspruch({
        userData,
        pdfValues: pdfParams,
      });

      expect(pdfValues.c1.value).toBeTruthy();
    });
  });
});
