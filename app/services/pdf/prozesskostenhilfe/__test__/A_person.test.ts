import {
  getProzesskostenhilfeParameters,
  type ProzesskostenhilfePDF,
} from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { newPageHint } from "../../attachment";
import {
  concatenateGesetzlicherVertreterString,
  fillPerson,
  GESETZLICHERVERTRETER_FIELD_MAX_CHARS,
} from "../A_person";

let pdfParams: ProzesskostenhilfePDF;
const userData: ProzesskostenhilfeFormularContext = {
  hasGesetzlicheVertretung: "yes",
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

    it("should fill the gesetzlicher Vertreter section with a new page hint if the string is too long", () => {
      const userDataWithLongString = {
        gesetzlicheVertretungDaten: {
          ...userData.gesetzlicheVertretungDaten,
          nachname: "a".repeat(
            GESETZLICHERVERTRETER_FIELD_MAX_CHARS -
              gesetzlicherVertreterString.length +
              2, // one more char than GESETZLICHERVERTRETER_FIELD_MAX_CHARS
          ),
        },
      } as ProzesskostenhilfeFormularContext;

      const gesetzlicherVertreterStringLong =
        concatenateGesetzlicherVertreterString(userDataWithLongString);
      const { pdfValues, attachment } = fillPerson({
        userData: userDataWithLongString,
        pdfValues: pdfParams,
      });
      expect(
        pdfValues
          .sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon
          .value,
      ).toBe(newPageHint);
      expect(attachment).toHaveLength(2);
      expect(
        attachment?.some(
          (element) => element.title === "Gesetzlicher Vertreter",
        ),
      ).toBe(true);
      expect(attachment?.at(0)?.title).toBe("Feld A: Angaben zu Ihrer Person");
      expect(attachment?.at(1)?.title).toBe("Gesetzlicher Vertreter");
      expect(attachment?.at(1)?.text).toBe(gesetzlicherVertreterStringLong);
    });
  });
});
