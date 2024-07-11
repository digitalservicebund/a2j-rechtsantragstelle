import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import {
  getListKidsUnterhaltPdfField,
  getListPersonUnterhaltPdfField,
} from "~/services/pdf/beratungshilfe/sections/E_unterhalt/unterhaltPdfField";

describe("unterhaltPdfField", () => {
  describe("getListPersonUnterhaltPdfField", () => {
    it("in case does not have a partner or unterhaltszahlungen, it should return an empty array", () => {
      const context: BeratungshilfeFormularContext = {};

      const actual = getListPersonUnterhaltPdfField(context);

      expect(actual.length).toEqual(0);
    });

    it("in case does have a partner, it should return the correct data", () => {
      const context: BeratungshilfeFormularContext = {
        partnerschaft: "yes",
        zusammenleben: "yes",
        unterhalt: "yes",
        partnerVorname: "Donald",
        partnerNachname: "Duck",
        klageEingereicht: "yes",
        unterhaltsSumme: "1000",
        partnerEinkommen: "yes",
      };

      const actual = getListPersonUnterhaltPdfField(context);

      expect(actual.length).toEqual(1);
      expect(actual[0].name).toEqual("Donald Duck");
      expect(actual[0].familienverhaeltnis).toEqual("Partner:in");
      expect(actual[0].unterhaltSumme).toEqual("1000");
      expect(actual[0].hatEinnahmen).toEqual(true);
      expect(actual[0].einnahmenSumme).toEqual("yes");
      expect(actual[0].lebenZusammen).toEqual(true);
    });

    it("in case does have unterhaltszahlungen, it should return the correct data", () => {
      const context: BeratungshilfeFormularContext = {
        hasWeitereUnterhaltszahlungen: "yes",
        unterhaltszahlungen: [
          {
            firstName: "firstName",
            surname: "surname",
            birthday: "10.10.2000",
            familyRelationship: "father",
            monthlyPayment: "100",
          },
        ],
      };

      const actual = getListPersonUnterhaltPdfField(context);

      expect(actual.length).toEqual(1);
      expect(actual[0].name).toEqual("firstName surname");
      expect(actual[0].familienverhaeltnis).toEqual("Mein Vater");
      expect(actual[0].unterhaltSumme).toEqual("100");
      expect(actual[0].hatEinnahmen).toEqual(false);
      expect(actual[0].einnahmenSumme).toEqual("");
      expect(actual[0].lebenZusammen).toEqual(true);
    });
  });

  describe("getListKidsUnterhaltPdfField", () => {
    it("in case does not have kid, it should return empty array", () => {
      const context: BeratungshilfeFormularContext = {};

      const actual = getListKidsUnterhaltPdfField(context);

      expect(actual.length).toEqual(0);
    });

    it("in case does have kids, it should return correct data", () => {
      const context: BeratungshilfeFormularContext = {
        kinder: [
          {
            eigeneEinnahmen: "yes",
            vorname: "Dagobert",
            nachname: "Duck",
            geburtsdatum: "01.01.2000",
            unterhaltsSumme: "500",
            einnahmen: "100",
            unterhalt: "yes",
            wohnortBeiAntragsteller: "yes",
          },
          {
            eigeneEinnahmen: "no",
            vorname: "Dagobert",
            nachname: "Daisy",
            geburtsdatum: "01.01.2001",
            unterhaltsSumme: "200",
            einnahmen: "0",
            unterhalt: "yes",
            wohnortBeiAntragsteller: "no",
          },
        ],
      };

      const actual = getListKidsUnterhaltPdfField(context);

      expect(actual.length).toEqual(2);

      expect(actual[0].name).toEqual("Dagobert Duck");
      expect(actual[0].familienverhaeltnis).toEqual("Mein Kind");
      expect(actual[0].unterhaltSumme).toEqual("500");
      expect(actual[0].hatEinnahmen).toEqual(true);
      expect(actual[0].einnahmenSumme).toEqual("100");
      expect(actual[0].lebenZusammen).toEqual(true);
      expect(actual[0].geburtsdatum).toEqual("01.01.2000");

      expect(actual[1].name).toEqual("Dagobert Daisy");
      expect(actual[1].familienverhaeltnis).toEqual("Mein Kind");
      expect(actual[1].unterhaltSumme).toEqual("200");
      expect(actual[1].hatEinnahmen).toEqual(false);
      expect(actual[1].einnahmenSumme).toEqual("0");
      expect(actual[1].lebenZusammen).toEqual(false);
      expect(actual[1].geburtsdatum).toEqual("01.01.2001");
    });
  });
});
