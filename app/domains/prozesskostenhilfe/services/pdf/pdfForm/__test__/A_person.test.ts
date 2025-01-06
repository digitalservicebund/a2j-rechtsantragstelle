import {
  getProzesskostenhilfeParameters,
  type ProzesskostenhilfePDF,
} from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import {
  concatenateAnschriftString,
  concatenateGesetzlicherVertreterString,
  concatenateNameVornameString,
  fillPerson,
} from "../A_person";

let pdfParams: ProzesskostenhilfePDF;
const userData: ProzesskostenhilfeFormularContext = {
  vorname: "Angelika",
  nachname: "M",
  beruf: "Musterberuf",
  strasseHausnummer: "Musterstraße 123",
  plz: "12345",
  ort: "O",
  telefonnummer: "0123456789",
  partnerschaft: "no",
  gesetzlicheVertretungDaten: {
    vorname: "Max",
    nachname: "M",
    strasseHausnummer: "Musterstraße 123",
    plz: "12345",
    ort: "Musterstadt",
    telefonnummer: "0123456789",
  },
};

describe("A_person", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });

  describe("Antragstellende Person", () => {
    it("should fill the Name, Vorname, ggf. Geburtsname section", () => {
      const { pdfValues, attachment } = fillPerson({
        userData,
        pdfValues: pdfParams,
      });

      expect(pdfValues.nameVornameggfGeburtsname.value).toBe(
        concatenateNameVornameString(userData),
      );
      expect(attachment).toHaveLength(0);
    });

    it("should fill the Beruf, Erwerbstätigkeit section", () => {
      const { pdfValues, attachment } = fillPerson({
        userData,
        pdfValues: pdfParams,
      });

      expect(pdfValues.berufErwerbstaetigkeit.value).toBe(userData.beruf);
      expect(attachment).toHaveLength(0);
    });

    it("should fill the Geburtsdatum section", () => {
      const { pdfValues, attachment } = fillPerson({
        userData,
        pdfValues: pdfParams,
      });

      expect(pdfValues.geburtsdatum.value).toBe(userData.geburtsdatum);
      expect(attachment).toHaveLength(0);
    });

    it("should fill the Familienstand section", () => {
      const { pdfValues, attachment } = fillPerson({
        userData,
        pdfValues: pdfParams,
      });

      expect(pdfValues.text3.value).toBe("ledig");
      expect(attachment).toHaveLength(0);
    });

    it("should fill the Anschrift section", () => {
      const anschriftString = concatenateAnschriftString(userData);
      const { pdfValues, attachment } = fillPerson({
        userData,
        pdfValues: pdfParams,
      });

      expect(
        pdfValues.anschriftStrasseHausnummerPostleitzahlWohnort.value,
      ).toBe(anschriftString);
      expect(attachment).toHaveLength(0);
    });

    it("should fill the Telefonnummer section", () => {
      const { pdfValues, attachment } = fillPerson({
        userData,
        pdfValues: pdfParams,
      });

      expect(pdfValues.text2.value).toBe(userData.telefonnummer);
      expect(attachment).toHaveLength(0);
    });
  });

  describe("gesetzlicher Vertreter", () => {
    const gesetzlicherVertreterString =
      concatenateGesetzlicherVertreterString(userData);
    it("should fill the gesetzlicher Vertreter section if the user has a legal guardian", () => {
      const { pdfValues, attachment } = fillPerson({
        userData,
        pdfValues: pdfParams,
      });

      expect(
        pdfValues
          .sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon
          .value,
      ).toBe(gesetzlicherVertreterString);
      expect(attachment).toHaveLength(0);
    });
  });
});
