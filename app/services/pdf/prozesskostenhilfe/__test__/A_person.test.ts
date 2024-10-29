import type { ProzesskostenhilfeFormularContext } from "app/flows/prozesskostenhilfe/formular";
import {
  getProzesskostenhilfeParameters,
  type ProzesskostenhilfePDF,
} from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../../attachment";
import { maritalDescriptionMapping } from "../../shared/maritalDescriptionMapping";
import {
  ANSCHRIFT_FIELD_MAX_CHARS,
  BERUF_FIELD_MAX_CHARS,
  concatenateAnschriftString,
  concatenateGesetzlicherVertreterString,
  concatenateNameVornameString,
  fillPerson,
  GESETZLICHERVERTRETER_FIELD_MAX_CHARS,
  NAME_VORNAME_FIELD_MAX_CHARS,
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

    it("should fill the Name, Vorname, ggf. Geburtsname section with a new page hint if the string is too long", () => {
      const userDataWithLongString = {
        ...userData,
        nachname: "a".repeat(
          NAME_VORNAME_FIELD_MAX_CHARS - userData.nachname!.length + 2, // one more char than NAME_VORNAME_FIELD_MAX_CHARS
        ),
      } as ProzesskostenhilfeFormularContext;

      const { pdfValues, attachment } = fillPerson({
        userData: userDataWithLongString,
        pdfValues: pdfParams,
      });

      expect(pdfValues.nameVornameggfGeburtsname.value).toBe(
        SEE_IN_ATTACHMENT_DESCRIPTION,
      );
      expect(attachment?.at(1)?.title).toBe("Name, Vorname, ggf. Geburtsname");
      expect(attachment?.at(1)?.text).toBe(
        concatenateNameVornameString(userDataWithLongString),
      );
    });
  });

  it("should fill the Beruf, Erwerbstätigkeit section", () => {
    const { pdfValues, attachment } = fillPerson({
      userData,
      pdfValues: pdfParams,
    });

    expect(pdfValues.berufErwerbstaetigkeit.value).toBe(userData.beruf);
    expect(attachment).toHaveLength(0);
  });

  it("should fill the Beruf, Erwerbstätigkeit section with a new page hint if the string is too long", () => {
    const userDataWithLongString = {
      ...userData,
      beruf: "a".repeat(
        BERUF_FIELD_MAX_CHARS + 1, // one more char than BERUF_FIELD_MAX_CHARS
      ),
    } as ProzesskostenhilfeFormularContext;

    const { pdfValues, attachment } = fillPerson({
      userData: userDataWithLongString,
      pdfValues: pdfParams,
    });

    expect(pdfValues.berufErwerbstaetigkeit.value).toBe(
      SEE_IN_ATTACHMENT_DESCRIPTION,
    );
    expect(attachment?.at(1)?.title).toBe("Beruf, Erwerbstätigkeit");
    expect(attachment?.at(1)?.text).toBe(userDataWithLongString.beruf);
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

  it("should fill the Familienstand section with a new page hint if the string is too long", () => {
    const userDataWithLongString = {
      ...userData,
      partnerschaft: "yes",
    } as ProzesskostenhilfeFormularContext;

    const { pdfValues, attachment } = fillPerson({
      userData: userDataWithLongString,
      pdfValues: pdfParams,
    });

    expect(pdfValues.text3.value).toBe("s.A.");
    expect(attachment?.at(1)?.title).toBe("Familienstand");
    expect(attachment?.at(1)?.text).toBe(maritalDescriptionMapping.yes);
  });

  it("should fill the Anschrift section", () => {
    const anschriftString = concatenateAnschriftString(userData);
    const { pdfValues, attachment } = fillPerson({
      userData,
      pdfValues: pdfParams,
    });

    expect(pdfValues.anschriftStrasseHausnummerPostleitzahlWohnort.value).toBe(
      anschriftString,
    );
    expect(attachment).toHaveLength(0);
  });

  it("shold fill the Anschift section with a new page hint if the string is too long", () => {
    const userDataWithLongString = {
      ...userData,
      ort: "a".repeat(
        ANSCHRIFT_FIELD_MAX_CHARS - userData.ort!.length + 2, // one more char than ANSCHRIFT_FIELD_MAX_CHARS
      ),
    } as ProzesskostenhilfeFormularContext;
    const anschriftStringLong = concatenateAnschriftString(
      userDataWithLongString,
    );

    const { pdfValues, attachment } = fillPerson({
      userData: userDataWithLongString,
      pdfValues: pdfParams,
    });

    expect(pdfValues.anschriftStrasseHausnummerPostleitzahlWohnort.value).toBe(
      SEE_IN_ATTACHMENT_DESCRIPTION,
    );
    expect(attachment?.at(1)?.title).toBe(
      "Anschrift (Straße, Hausnummer, Postleitzahl Wohnort)",
    );
    expect(attachment?.at(1)?.text).toBe(anschriftStringLong);
  });

  it("should fill the Telefonnummer section", () => {
    const { pdfValues, attachment } = fillPerson({
      userData,
      pdfValues: pdfParams,
    });

    expect(pdfValues.text2.value).toBe(userData.telefonnummer);
    expect(attachment).toHaveLength(0);
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
      ).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);
      expect(attachment?.at(1)?.title).toBe("Gesetzlicher Vertreter");
      expect(attachment?.at(1)?.text).toBe(gesetzlicherVertreterStringLong);
    });
  });
});
