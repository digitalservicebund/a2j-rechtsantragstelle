import {
  getProzesskostenhilfeParameters,
  type ProzesskostenhilfePDF,
} from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { fillUnterhaltsanspruch } from "../C_unterhaltspflichtige_person";

let pdfParams: ProzesskostenhilfePDF;
const userData: ProzesskostenhilfeFormularUserData = {
  vorname: "Angelika",
  nachname: "M",
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

      expect(pdfValues.namedesUnterhaltspflichtingen.value).toBe(
        "unterhaltVor unterhaltNach, Mein Vater",
      );
      expect(
        pdfValues
          .jaichhabeAngehoerigedieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind
          .value,
      ).toBeTruthy();
    });

    it("should select correct checkbox if none is present", () => {
      const { pdfValues } = fillUnterhaltsanspruch({
        userData,
        pdfValues: pdfParams,
      });

      expect(
        pdfValues
          .neinichhabekeineAngehoerigendieIhnengegenubergesetzlichzurLeistungvonUnterhaltverpflichtetsind
          .value,
      ).toBeTruthy();
    });
  });
});
