import { describe, it, expect } from "vitest";
import {
  getArbeitStrings,
  getPKontoStrings,
  getPrivilegierteForderungStrings,
  getErhoehungsbetragStrings,
  getKindergeldStrings,
  getWohngeldStrings,
  getEinmalSozialleistungStrings,
  getNachzahlungSozialUnter500Strings,
  getNachzahlungSozialMehr500Strings,
  getNachzahlungArbeitUnter500Strings,
  getNachzahlungArbeitMehr500Strings,
  getBuergergeldStrings,
  getGrundsicherungStrings,
  getAsylbewerberleistungStrings,
  getArbeitsentgeltEinmaligStrings,
  getSelbststaendigStrings,
  getAngestelltStrings,
  getKinderStrings,
  getSchuldnerberatungsstelleStrings,
  getAmtsgerichtStrings,
  getInfoZumPKontoStrings,
  getHasErhöhungStrings,
  getPflegegeldStrings,
  getRenteStrings,
} from "../stringReplacements";
import { type KontopfaendungWegweiserUserData } from "../userData";

describe("stringReplacements", () => {
  describe("getArbeitStrings", () => {
    it("should return correct Arbeit strings", () => {
      const userData: KontopfaendungWegweiserUserData = { hasArbeit: "yes" };
      expect(getArbeitStrings(userData)).toEqual({
        hasArbeit: true,
      });
    });
  });
  describe("getPkontoStrings", () => {
    it("should return correct PKonto strings", () => {
      const userData: KontopfaendungWegweiserUserData = { hasPKonto: "ja" };
      expect(getPKontoStrings(userData)).toEqual({
        hasPKonto: true,
        hasNoPKonto: false,
        hasPKontoBank: false,
        hasPKontoNichtAktive: false,
      });
    });
  });
  describe("getPrivilegierteForderungStrings", () => {
    it("should return correct Privilegierte Forderung strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        pfaendungStrafe: "yes",
        pfaendungUnterhalt: "no",
      };
      expect(getPrivilegierteForderungStrings(userData)).toEqual({
        isPrivilegierteForderungStrafe: true,
        isPrivilegierteForderungUnterhalt: false,
      });
    });
  });
  describe("getErhoehungsbetragStrings", () => {
    const testCases: KontopfaendungWegweiserUserData[] = [
      { kinderWohnenZusammen: "ja" },
      { kinderWohnenZusammen: "teilweise" },
      { kinderUnterhalt: "yes" },
      { partnerUnterhalt: "yes" },
      { partnerWohnenZusammen: "yes" },
    ];
    test.each(testCases)("should return true given %o", (userData) => {
      const { hasErhoehungsbetrag } = getErhoehungsbetragStrings(userData);
      expect(hasErhoehungsbetrag).toEqual(true);
    });

    it("should return false if none of the prerequisites are met", () => {
      const userData: KontopfaendungWegweiserUserData = {
        kinderWohnenZusammen: "nein",
        kinderUnterhalt: "no",
        partnerUnterhalt: "no",
        partnerWohnenZusammen: "no",
      };
      const { hasErhoehungsbetrag } = getErhoehungsbetragStrings(userData);
      expect(hasErhoehungsbetrag).toEqual(false);
    });
  });
  describe("getKindergeldStrings", () => {
    it("should return correct Kindergeld strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasKindergeld: "yes",
      };
      expect(getKindergeldStrings(userData)).toEqual({
        hasKindergeld: true,
      });
    });
  });
  describe("getWohngeldStrings", () => {
    it("should return correct Wohngeld strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasWohngeld: "yes",
      };
      expect(getWohngeldStrings(userData)).toEqual({
        hasWohngeld: true,
      });
    });
  });
  describe("getEinmalSozialleistungStrings", () => {
    it("should return correct Einmal Sozialleistung strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasSozialleistungenEinmalzahlung: "yes",
      };
      expect(getEinmalSozialleistungStrings(userData)).toEqual({
        hasEinmalSozialleistung: true,
      });
    });
  });
  describe("getNachzahlungSozialUnter500Strings", () => {
    it("should return correct Nachzahlung Sozial Unter 500 strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasSozialleistungNachzahlung: "yes",
        hasWohngeld: "yes",
        hasKindergeld: "yes",
      };
      expect(getNachzahlungSozialUnter500Strings(userData)).toEqual({
        hasNachzahlungSozialUnter500: true,
      });
    });
  });
  describe("getNachzahlungSozialMehr500Strings", () => {
    it("should return correct Nachzahlung Sozial Mehr 500 strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasSozialleistungNachzahlung: "yes",
        sozialleistungNachzahlungHigherThan: "yes",
      };
      expect(getNachzahlungSozialMehr500Strings(userData)).toEqual({
        hasNachzahlungSozialMehr500: true,
      });
    });
  });
  describe("getNachzahlungArbeitUnter500Strings", () => {
    it("should return correct Nachzahlung Arbeit Unter 500 strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        arbeitgeberNachzahlungHigherThan: "no",
        nachzahlungArbeitgeber: "yes",
      };
      expect(getNachzahlungArbeitUnter500Strings(userData)).toEqual({
        hasNachzahlungArbeitUnter500: true,
      });
    });
  });
  describe("getNachzahlungArbeitMehr500Strings", () => {
    it("should return correct Nachzahlung Arbeit Mehr 500 strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        arbeitgeberNachzahlungHigherThan: "yes",
        nachzahlungArbeitgeber: "yes",
      };
      expect(getNachzahlungArbeitMehr500Strings(userData)).toEqual({
        hasNachzahlungArbeitMehr500: true,
      });
    });
  });
  describe("getBuergergeldStrings", () => {
    it("should return correct Buergergeld strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasSozialleistungen: "buergergeld",
      };
      expect(getBuergergeldStrings(userData)).toEqual({
        hasBuergergeld: true,
      });
    });
  });
  describe("getGrundsicherungStrings", () => {
    it("should return correct Grundsicherung strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasSozialleistungen: "grundsicherungSozialhilfe",
      };
      expect(getGrundsicherungStrings(userData)).toEqual({
        hasGrundsicherung: true,
      });
    });
  });
  describe("getAsylbewerberleistungStrings", () => {
    it("should return correct Asylbewerberleistung strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasSozialleistungen: "asylbewerberleistungen",
      };
      expect(getAsylbewerberleistungStrings(userData)).toEqual({
        hasAsylbewerberleistung: true,
      });
    });
  });
  describe("getPflegegeldStrings", () => {
    it("should return correct Pflegegeld strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasPflegegeld: "yes",
      };
      expect(getPflegegeldStrings(userData)).toEqual({
        hasPflegegeld: true,
      });
    });
  });
  describe("getArbeitsentgeltEinmaligStrings", () => {
    it("should return correct Arbeitsentgelt Einmalig strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        zahlungArbeitgeber: {
          urlaubsgeld: "off",
          weihnachtsgeld: "on",
          ueberstundenBezahlt: "off",
          abfindung: "off",
          anderes: "off",
        },
      };
      expect(getArbeitsentgeltEinmaligStrings(userData)).toEqual({
        hasArbeitsentgeltEinmalig: true,
      });
    });
  });
  describe("getSelbststaendigStrings", () => {
    it("should return correct Selbststaendig strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        arbeitArt: {
          selbstaendig: "on",
          angestellt: "off",
        },
      };
      expect(getSelbststaendigStrings(userData)).toEqual({
        isSelbststaendig: true,
      });
    });
  });
  describe("getAngestelltStrings", () => {
    it("should return correct Angestellt strings", () => {
      const userData: KontopfaendungWegweiserUserData = {
        arbeitArt: {
          angestellt: "on",
          selbstaendig: "off",
        },
      };
      expect(getAngestelltStrings(userData)).toEqual({
        isAngestellt: true,
      });
    });
  });
  describe("getKinderStrings", () => {
    it("should return correct Kinder strings", () => {
      const userData: KontopfaendungWegweiserUserData = { hasKinder: "yes" };
      expect(getKinderStrings(userData)).toEqual({
        hasKinder: true,
      });
    });
  });
  describe("getRenteStrings", () => {
    it("should return correct Rente strings", () => {
      const userData: KontopfaendungWegweiserUserData = { hasRente: "yes" };
      expect(getRenteStrings(userData)).toEqual({
        hasRente: true,
      });
    });
  });
  describe("getSchuldnerberatungsstelleStrings", () => {
    it("should return schuldnerberatungsstelleIsVisible as true when at least one sub variable is true", () => {
      const userData: KontopfaendungWegweiserUserData = {
        kinderWohnenZusammen: "ja",
        hasKindergeld: "yes",
        hasSozialleistungenEinmalzahlung: "yes",
        hasSozialleistungNachzahlung: "yes",
        sozialleistungNachzahlungHigherThan: "no",
        nachzahlungArbeitgeber: "yes",
        arbeitgeberNachzahlungHigherThan: "no",
        hasSozialleistungen: "buergergeld",
        pflegegeld: "selbst",
      };

      expect(getSchuldnerberatungsstelleStrings(userData)).toEqual({
        schuldnerberatungsstelleIsVisible: true,
      });
    });
    it("should return schuldnerberatungsstelleIsVisible as false when all sub variables are false", () => {
      const userData: KontopfaendungWegweiserUserData = {
        kinderWohnenZusammen: "nein",
        hasKindergeld: "no",
        hasPflegegeld: "no",
        hasWohngeld: "no",
        hasSozialleistungenEinmalzahlung: "no",
        hasSozialleistungNachzahlung: "no",
        sozialleistungNachzahlungHigherThan: "no",
        nachzahlungArbeitgeber: "no",
        arbeitgeberNachzahlungHigherThan: "no",
        hasSozialleistungen: "nein",
        pflegegeld: "fremd",
      };

      expect(getSchuldnerberatungsstelleStrings(userData)).toEqual({
        schuldnerberatungsstelleIsVisible: false,
      });
    });
  });

  describe("getAmtsgerichtStrings", () => {
    it("should return amtsgerichtIsVisible as true when at least one sub variable is true", () => {
      const userData: KontopfaendungWegweiserUserData = {
        pflegegeld: "fremd",
        nachzahlungArbeitgeber: "no",
        arbeitgeberNachzahlungHigherThan: "no",
        hasSozialleistungNachzahlung: "yes",
        sozialleistungNachzahlungHigherThan: "yes",
        arbeitArt: {
          angestellt: "off",
          selbstaendig: "on",
        },
        hasWohngeld: "yes",
      };
      expect(getAmtsgerichtStrings(userData)).toEqual({
        amtsgerichtIsVisible: true,
      });
    });
    it("should return amtsgerichtIsVisible as false when all sub variants are false", () => {
      const userData: KontopfaendungWegweiserUserData = {
        pflegegeld: "selbst",
        nachzahlungArbeitgeber: "no",
        arbeitgeberNachzahlungHigherThan: "no",
        hasSozialleistungNachzahlung: "no",
        sozialleistungNachzahlungHigherThan: "no",
        arbeitArt: {
          angestellt: "on",
          selbstaendig: "off",
        },
        hasKindergeld: "yes",
      };
      expect(getAmtsgerichtStrings(userData)).toEqual({
        amtsgerichtIsVisible: false,
      });
    });
  });

  describe("getInfoZumPKontoStrings", () => {
    it("should return infoZumPKontoIsVisible as true when at least one sub variable is true", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasPKonto: "nein",
        pfaendungStrafe: "yes",
        pfaendungUnterhalt: "yes",
      };
      expect(getInfoZumPKontoStrings(userData)).toEqual({
        infoZumPKontoIsVisible: true,
      });
    });
    it("should return infoZumPKontoIsVisible as false when all sub variables are false", () => {
      const userData: KontopfaendungWegweiserUserData = {
        hasPKonto: "ja",
        pfaendungStrafe: "no",
        pfaendungUnterhalt: "no",
      };
      expect(getInfoZumPKontoStrings(userData)).toEqual({
        infoZumPKontoIsVisible: false,
      });
    });
  });
  describe("getHasErhöhungStrings", () => {
    it("should return hasErhöhung as true when at least one sub variable is true", () => {
      const userData: KontopfaendungWegweiserUserData = {
        kinderWohnenZusammen: "ja",
        hasKindergeld: "yes",
        hasSozialleistungenEinmalzahlung: "yes",
        hasSozialleistungNachzahlung: "yes",
        sozialleistungNachzahlungHigherThan: "no",
      };
      expect(getHasErhöhungStrings(userData)).toEqual({
        hasErhöhung: true,
      });
    });
    it("should return hasErhöhung as false when all sub variables are false", () => {
      const userData: KontopfaendungWegweiserUserData = {
        kinderWohnenZusammen: "nein",
        hasKindergeld: "no",
        hasPflegegeld: "no",
        hasWohngeld: "no",
        hasSozialleistungenEinmalzahlung: "no",
        hasSozialleistungNachzahlung: "no",
        sozialleistungNachzahlungHigherThan: "no",
      };
      expect(getHasErhöhungStrings(userData)).toEqual({
        hasErhöhung: false,
      });
    });
  });
});
