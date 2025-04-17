import { describe, it, expect } from "vitest";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import { type KontopfaendungWegweiserContext } from "../context";
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
  getPflegegeldSelbstStrings,
  getPflegegeldFremdStrings,
  getBehordenschuldenStrings,
  getArbeitsentgeltEinmaligStrings,
  getSelbststaendigStrings,
  getAngestelltStrings,
  getKinderStrings,
} from "../stringReplacements";

describe("stringReplacements", () => {
  describe("getArbeitStrings", () => {
    it("should return correct Arbeit strings", () => {
      const userData: KontopfaendungWegweiserContext = { hasArbeit: "yes" };
      expect(getArbeitStrings(userData)).toEqual({
        hasArbeit: true,
      });
    });
  });
  describe("getPkontoStrings", () => {
    it("should return correct PKonto strings", () => {
      const userData: KontopfaendungWegweiserContext = { hasPKonto: "ja" };
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
      const userData: KontopfaendungWegweiserContext = {
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
    it("should return correct Erhoehungsbetrag strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        kinderWohnenZusammen: "ja",
      };
      expect(getErhoehungsbetragStrings(userData)).toEqual({
        hasErhoehungsbetrag: true,
      });
    });
  });
  describe("getKindergeldStrings", () => {
    it("should return correct Kindergeld strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        sozialleistungenUmstaende: {
          kindergeld: CheckboxValue.on,
          nein: CheckboxValue.off,
          pflegegeld: CheckboxValue.off,
          wohngeld: CheckboxValue.off,
        },
      };
      expect(getKindergeldStrings(userData)).toEqual({
        hasKindergeld: true,
      });
    });
  });
  describe("getWohngeldStrings", () => {
    it("should return correct Wohngeld strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        sozialleistungenUmstaende: {
          wohngeld: CheckboxValue.on,
          nein: CheckboxValue.off,
          pflegegeld: CheckboxValue.off,
          kindergeld: CheckboxValue.off,
        },
      };
      expect(getWohngeldStrings(userData)).toEqual({
        hasWohngeld: true,
      });
    });
  });
  describe("getEinmalSozialleistungStrings", () => {
    it("should return correct Einmal Sozialleistung strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        hasSozialleistungenEinmalzahlung: "yes",
      };
      expect(getEinmalSozialleistungStrings(userData)).toEqual({
        hasEinmalSozialleistung: true,
      });
    });
  });
  describe("getNachzahlungSozialUnter500Strings", () => {
    it("should return correct Nachzahlung Sozial Unter 500 strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        sozialleistungNachzahlungHigherThan: "no",
      };
      expect(getNachzahlungSozialUnter500Strings(userData)).toEqual({
        hasNachzahlungSozialUnter500: true,
      });
    });
  });
  describe("getNachzahlungSozialMehr500Strings", () => {
    it("should return correct Nachzahlung Sozial Mehr 500 strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        sozialleistungNachzahlungHigherThan: "yes",
      };
      expect(getNachzahlungSozialMehr500Strings(userData)).toEqual({
        hasNachzahlungSozialMehr500: true,
      });
    });
  });
  describe("getNachzahlungArbeitUnter500Strings", () => {
    it("should return correct Nachzahlung Arbeit Unter 500 strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        nachzahlungArbeitgeber: "no",
      };
      expect(getNachzahlungArbeitUnter500Strings(userData)).toEqual({
        hasNachzahlungArbeitUnter500: true,
      });
    });
  });
  describe("getNachzahlungArbeitMehr500Strings", () => {
    it("should return correct Nachzahlung Arbeit Mehr 500 strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        nachzahlungArbeitgeber: "yes",
      };
      expect(getNachzahlungArbeitMehr500Strings(userData)).toEqual({
        hasNachzahlungArbeitMehr500: true,
      });
    });
  });
  describe("getBuergergeldStrings", () => {
    it("should return correct Buergergeld strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        hasSozialleistungen: "buergergeld",
      };
      expect(getBuergergeldStrings(userData)).toEqual({
        hasBuergergeld: true,
      });
    });
  });
  describe("getGrundsicherungStrings", () => {
    it("should return correct Grundsicherung strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        hasSozialleistungen: "grundsicherungSozialhilfe",
      };
      expect(getGrundsicherungStrings(userData)).toEqual({
        hasGrundsicherung: true,
      });
    });
  });
  describe("getAsylbewerberleistungStrings", () => {
    it("should return correct Asylbewerberleistung strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        hasSozialleistungen: "asylbewerberleistungen",
      };
      expect(getAsylbewerberleistungStrings(userData)).toEqual({
        hasAsylbewerberleistung: true,
      });
    });
  });
  describe("getPflegegeldSelbstStrings", () => {
    it("should return correct Pflegegeld Selbst strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        pflegegeld: "selbst",
      };
      expect(getPflegegeldSelbstStrings(userData)).toEqual({
        hasPflegegeldSelbst: true,
      });
    });
  });
  describe("getPflegegeldFremdStrings", () => {
    it("should return correct Pflegegeld Fremd strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        pflegegeld: "fremd",
      };
      expect(getPflegegeldFremdStrings(userData)).toEqual({
        hasPflegegeldFremd: true,
      });
    });
  });
  describe("getBehordenschuldenStrings", () => {
    it("should return correct Behordenschulden strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        schuldenBei: "privat",
      };
      expect(getBehordenschuldenStrings(userData)).toEqual({
        hasBehordenschuldenPrivat: true,
        hasBehordenschuldenBehoerden: false,
        hasBehordenschuldenKredit: false,
        hasBehordenschuldenKrankenkasse: false,
        hasBehordenschuldenRechnung: false,
        hasBehordenschuldenBeitragsservice: false,
        hasBehordenschuldenFinanzamt: false,
        hasBehordenschuldenHauptzollamt: false,
        hasBehordenschuldenNichtSagen: false,
        hasBehordenschuldenWeissNicht: false,
        hasBehordenschuldenStaatsanwaltschaft: false,
        hasBehordenschuldenKasse: false,
        hasBehordenschuldenJugendamt: false,
      });
    });
  });
  describe("getArbeitsentgeltEinmaligStrings", () => {
    it("should return correct Arbeitsentgelt Einmalig strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        zahlungArbeitgeber: {
          urlaubsgeld: CheckboxValue.off,
          weihnachtsgeld: CheckboxValue.on,
          ueberstundenBezahlt: CheckboxValue.off,
          abfindung: CheckboxValue.off,
          anderes: CheckboxValue.off,
        },
      };
      expect(getArbeitsentgeltEinmaligStrings(userData)).toEqual({
        hasArbeitsentgeltEinmalig: true,
      });
    });
  });
  describe("getSelbststaendigStrings", () => {
    it("should return correct Selbststaendig strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        arbeitArt: {
          selbstaendig: CheckboxValue.on,
          angestellt: CheckboxValue.off,
        },
      };
      expect(getSelbststaendigStrings(userData)).toEqual({
        isSelbststaendig: true,
      });
    });
  });
  describe("getAngestelltStrings", () => {
    it("should return correct Angestellt strings", () => {
      const userData: KontopfaendungWegweiserContext = {
        arbeitArt: {
          angestellt: CheckboxValue.on,
          selbstaendig: CheckboxValue.off,
        },
      };
      expect(getAngestelltStrings(userData)).toEqual({
        isAngestellt: true,
      });
    });
  });
  describe("getKinderStrings", () => {
    it("should return correct Kinder strings", () => {
      const userData: KontopfaendungWegweiserContext = { hasKinder: "yes" };
      expect(getKinderStrings(userData)).toEqual({
        hasKinder: true,
      });
    });
  });
});
