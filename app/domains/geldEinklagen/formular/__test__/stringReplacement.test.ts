import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { getResponsibleCourt } from "../../services/court/getResponsibleCourt";
import {
  hasClaimVertrag,
  hasExclusivePlaceJurisdictionOrSelectCourt,
  isBeklagtePerson,
  isCourtAGSchoeneberg,
  getCourtCost,
  getKlagendePersonInfo,
  getBeklagtePersonInfo,
  getSachverhaltInfo,
  getProzesszinsenInfo,
  getZusaetzlicheAngabenInfo,
} from "../stringReplacements";
import { type GeldEinklagenFormularUserData } from "../userData";

vi.mock("../../services/court/getResponsibleCourt");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("stringReplacement", () => {
  describe("isBeklagtePerson", () => {
    it("should return true in case gegenWenBeklagen is person", () => {
      const context = {
        gegenWenBeklagen: "person" as const,
      };

      const actual = isBeklagtePerson(context);
      expect(actual.isBeklagtePerson).toBe(true);
    });

    it("should return false in case gegenWenBeklagen is organisation", () => {
      const context = {
        gegenWenBeklagen: "organisation" as const,
      };

      const actual = isBeklagtePerson(context);
      expect(actual.isBeklagtePerson).toBe(false);
    });

    it("should return false in case gegenWenBeklagen is undefined", () => {
      const context = {
        gegenWenBeklagen: undefined,
      };

      const actual = isBeklagtePerson(context);
      expect(actual.isBeklagtePerson).toBe(false);
    });
  });

  describe("hasClaimVertrag", () => {
    it("should return hasClaimVertrag as true in case is versicherungVertrag yes", () => {
      const context: GeldEinklagenFormularUserData = {
        versicherungVertrag: "yes",
        klagendeVertrag: "no",
        mietePachtVertrag: "no",
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(true);
    });

    it("should return hasClaimVertrag as true in case is klagendeVertrag yes", () => {
      const context: GeldEinklagenFormularUserData = {
        versicherungVertrag: "no",
        klagendeVertrag: "yes",
        mietePachtVertrag: "no",
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(true);
    });

    it("should return hasClaimVertrag as true in case is mietePachtVertrag yes", () => {
      const context: GeldEinklagenFormularUserData = {
        versicherungVertrag: "no",
        klagendeVertrag: "no",
        mietePachtVertrag: "yes",
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(true);
    });

    it("should return hasClaimVertrag as false in case is mietePachtVertrag, versicherungVertrag and klagendeVertrag are no", () => {
      const context: GeldEinklagenFormularUserData = {
        mietePachtVertrag: "no",
        versicherungVertrag: "no",
        klagendeVertrag: "no",
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(false);
    });
  });

  describe("hasExclusivePlaceJurisdictionOrSelectCourt", () => {
    it("should return true if sachgebiet is miete and mietePachtRaum and mietePachtVertrag are yes", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "miete",
        mietePachtRaum: "yes",
        mietePachtVertrag: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(true);
    });

    it("should return false if sachgebiet is versicherung", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "versicherung",
        mietePachtRaum: "yes",
        mietePachtVertrag: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(false);
    });

    it("should return false if mietePachtRaum is no", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "miete",
        mietePachtRaum: "no",
        mietePachtVertrag: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(false);
    });

    it("should return false if mietePachtVertrag is not yes", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "miete",
        mietePachtRaum: "yes",
        mietePachtVertrag: "no",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(false);
    });

    it("should return true if gerichtsstandsvereinbarung yes", () => {
      const context: GeldEinklagenFormularUserData = {
        gerichtsstandsvereinbarung: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(true);
    });

    it("should return true if sachgebiet is urheberrecht and beklagtePersonGeldVerdienen is no", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "urheberrecht",
        beklagtePersonGeldVerdienen: "no",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(true);
    });

    it("should return false if sachgebiet is urheberrecht and beklagtePersonGeldVerdienen is yes", () => {
      const context: GeldEinklagenFormularUserData = {
        sachgebiet: "urheberrecht",
        beklagtePersonGeldVerdienen: "yes",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(false);
    });

    it("should return true pilotGerichtAuswahl is not undefined", () => {
      const context: GeldEinklagenFormularUserData = {
        pilotGerichtAuswahl: "beklagteCourt",
      };

      const actual = hasExclusivePlaceJurisdictionOrSelectCourt(context);
      expect(actual.hasExclusivePlaceJurisdictionOrSelectCourt).toBe(true);
    });
  });

  describe("isCourtAGSchoeneberg", () => {
    it("should return true if court AG Schoeneberg", () => {
      const courtData: Jmtd14VTErwerberGerbeh = {
        LKZ: "11",
        OLG: "1",
        LG: "01",
        AG: "07",
        TYP_INFO: "Zivilgericht - Amtsgericht",
        BEZEICHNUNG: "Amtsgericht Schöneberg",
        ORT: "",
        ORTK: "",
        PLZ_ZUSTELLBEZIRK: "10823",
        STR_HNR: "",
        XML_SUPPORT: "JA" as const,
      };

      vi.mocked(getResponsibleCourt).mockReturnValueOnce(courtData);

      const actual = isCourtAGSchoeneberg({});
      expect(actual.isCourtAGSchoeneberg).toBe(true);
    });

    it("should return false if court is not AG Schoeneberg", () => {
      const courtData: Jmtd14VTErwerberGerbeh = {
        LKZ: "11",
        OLG: "1",
        LG: "01",
        AG: "07",
        TYP_INFO: "Zivilgericht - Amtsgericht",
        BEZEICHNUNG: "Amtsgericht Lichtenberg",
        ORT: "",
        ORTK: "",
        PLZ_ZUSTELLBEZIRK: "10365",
        STR_HNR: "",
        XML_SUPPORT: "JA" as const,
      };

      vi.mocked(getResponsibleCourt).mockReturnValueOnce(courtData);

      const actual = isCourtAGSchoeneberg({});
      expect(actual.isCourtAGSchoeneberg).toBe(false);
    });
  });

  describe("getCourtCost", () => {
    it.each([
      ["99,00", "80,00"],
      ["500,01", "122,00"],
      ["1.000,00", "122,00"],
      ["1.234,56", "164,00"],
      ["9.000,00", "521,00"],
      ["9.999,99", "566,00"],
    ])(
      "should return %s court cost for claim amount %s",
      (forderungGesamtbetrag, courtCost) => {
        const actual = getCourtCost({ forderungGesamtbetrag });

        expect(actual).toEqual({ courtCost });
      },
    );
  });

  describe("getKlagendePersonInfo", () => {
    it("should return klagende person info fields", () => {
      const context: GeldEinklagenFormularUserData = {
        klagendePersonAnrede: "herr",
        klagendePersonTitle: "dr",
        klagendePersonVorname: "Max",
        klagendePersonNachname: "Mustermann",
        klagendePersonStrasseHausnummer: "Musterstr. 1",
        klagendePersonPlz: "12345",
        klagendePersonOrt: "Musterstadt",
        klagendeTelefonnummer: "0123",
        klagendePersonIban: "DE0012345678",
        klagendePersonKontoinhaber: "Max Mustermann",
      };

      const actual = getKlagendePersonInfo(context);

      expect(actual).toEqual({
        klagendePersonAnrede: "herr",
        klagendePersonTitle: "dr",
        klagendePersonVorname: "Max",
        klagendePersonNachname: "Mustermann",
        klagendePersonStrasseHausnummer: "Musterstr. 1",
        klagendePersonPlz: "12345",
        klagendePersonOrt: "Musterstadt",
        klagendeTelefonnummer: "0123",
        klagendePersonIban: "DE0012345678",
        klagendePersonKontoinhaber: "Max Mustermann",
      });
    });
  });

  describe("getBeklagtePersonInfo", () => {
    it("should return beklagte person info fields", () => {
      const context: GeldEinklagenFormularUserData = {
        beklagteAnrede: "frau",
        beklagteTitle: "none",
        beklagteVorname: "Erika",
        beklagteNachname: "Musterfrau",
        beklagteStrasseHausnummer: "Beispielweg 2",
        beklagtePlz: "54321",
        beklagteOrt: "Beispielstadt",
      };

      const actual = getBeklagtePersonInfo(context);

      expect(actual).toEqual({
        beklagteAnrede: "frau",
        beklagteTitle: "none",
        beklagteVorname: "Erika",
        beklagteNachname: "Musterfrau",
        beklagteStrasseHausnummer: "Beispielweg 2",
        beklagtePlz: "54321",
        beklagteOrt: "Beispielstadt",
      });
    });
  });

  describe("getSachverhaltInfo", () => {
    it("should return sachverhalt info fields", () => {
      const context: GeldEinklagenFormularUserData = {
        forderungGesamtbetrag: "1000",
        sachverhaltBegruendung: "Begründung",
        beweiseAngebot: "yes",
      };

      const actual = getSachverhaltInfo(context);

      expect(actual).toEqual({
        forderungGesamtbetrag: "1000",
        sachverhaltBegruendung: "Begründung",
        beweiseAngebot: "yes",
      });
    });
  });

  describe("getProzesszinsenInfo", () => {
    it("should return prozesszinsen info fields (keeps existing key name)", () => {
      const context: GeldEinklagenFormularUserData = {
        prozesszinsen: "yes",
        anwaltskosten: "200",
        streitbeilegung: "no",
        muendlicheVerhandlung: "yes",
        videoVerhandlung: "no",
        versaeumnisurteil: "no",
      };

      const actual = getProzesszinsenInfo(context);

      expect(actual).toEqual({
        prozesszisnsen: "yes",
        anwaltskosten: "200",
        streitbeilegung: "no",
        muendlicheVerhandlung: "yes",
        videoVerhandlung: "no",
        versaeumnisurteil: "no",
      });
    });
  });

  describe("getZusaetzlicheAngabenInfo", () => {
    it("should return additional Angaben including rechtlicheWuerdigung", () => {
      const context: GeldEinklagenFormularUserData = {
        weitereAntraege: "Sonstige Anträge",
        rechtlicheWuerdigung: "Rechtliche Würdigung Text",
      };

      const actual = getZusaetzlicheAngabenInfo(context);

      expect(actual).toEqual({
        weitereAntraege: "Sonstige Anträge",
        rechtlicheWuerdigung: "Rechtliche Würdigung Text",
      });
    });
  });
});
