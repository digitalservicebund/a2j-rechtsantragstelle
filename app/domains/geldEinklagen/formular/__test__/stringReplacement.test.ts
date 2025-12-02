import {
  hasClaimVertrag,
  hasExclusivePlaceJurisdiction,
  isBeklagtePerson,
} from "../stringReplacements";

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
      const context = {
        versicherungVertrag: "yes" as const,
        klagendeVertrag: "no" as const,
        mietePachtVertrag: "no" as const,
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(true);
    });

    it("should return hasClaimVertrag as true in case is klagendeVertrag yes", () => {
      const context = {
        versicherungVertrag: "no" as const,
        klagendeVertrag: "yes" as const,
        mietePachtVertrag: "no" as const,
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(true);
    });

    it("should return hasClaimVertrag as true in case is mietePachtVertrag yes", () => {
      const context = {
        versicherungVertrag: "no" as const,
        klagendeVertrag: "no" as const,
        mietePachtVertrag: "yes" as const,
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(true);
    });

    it("should return hasClaimVertrag as false in case is mietePachtVertrag, versicherungVertrag and klagendeVertrag are no", () => {
      const context = {
        mietePachtVertrag: "no" as const,
        versicherungVertrag: "no" as const,
        klagendeVertrag: "no" as const,
      };

      const actual = hasClaimVertrag(context);
      expect(actual.hasClaimVertrag).toBe(false);
    });
  });

  describe("hasExclusivePlaceJurisdiction", () => {
    it("should return true if sachgebiet is miete and mietePachtRaum and mietePachtVertrag are yes", () => {
      const context = {
        sachgebiet: "miete" as const,
        mietePachtRaum: "yes" as const,
        mietePachtVertrag: "yes" as const,
      };

      const actual = hasExclusivePlaceJurisdiction(context);
      expect(actual.hasExclusivePlaceJurisdiction).toBe(true);
    });

    it("should return false if sachgebiet is versicherung", () => {
      const context = {
        sachgebiet: "versicherung" as const,
        mietePachtRaum: "yes" as const,
        mietePachtVertrag: "yes" as const,
      };

      const actual = hasExclusivePlaceJurisdiction(context);
      expect(actual.hasExclusivePlaceJurisdiction).toBe(false);
    });

    it("should return false if mietePachtRaum is no", () => {
      const context = {
        sachgebiet: "miete" as const,
        mietePachtRaum: "no" as const,
        mietePachtVertrag: "yes" as const,
      };

      const actual = hasExclusivePlaceJurisdiction(context);
      expect(actual.hasExclusivePlaceJurisdiction).toBe(false);
    });

    it("should return false if mietePachtVertrag is not yes", () => {
      const context = {
        sachgebiet: "miete" as const,
        mietePachtRaum: "yes" as const,
        mietePachtVertrag: "no" as const,
      };

      const actual = hasExclusivePlaceJurisdiction(context);
      expect(actual.hasExclusivePlaceJurisdiction).toBe(false);
    });

    it("should return true if gerichtsstandsvereinbarung yes", () => {
      const context = {
        gerichtsstandsvereinbarung: "yes" as const,
      };

      const actual = hasExclusivePlaceJurisdiction(context);
      expect(actual.hasExclusivePlaceJurisdiction).toBe(true);
    });

    it("should return true if sachgebiet is urheberrecht and beklagtePersonGeldVerdienen is no", () => {
      const context = {
        sachgebiet: "urheberrecht" as const,
        beklagtePersonGeldVerdienen: "no" as const,
      };

      const actual = hasExclusivePlaceJurisdiction(context);
      expect(actual.hasExclusivePlaceJurisdiction).toBe(true);
    });

    it("should return false if sachgebiet is urheberrecht and beklagtePersonGeldVerdienen is yes", () => {
      const context = {
        sachgebiet: "urheberrecht" as const,
        beklagtePersonGeldVerdienen: "yes" as const,
      };

      const actual = hasExclusivePlaceJurisdiction(context);
      expect(actual.hasExclusivePlaceJurisdiction).toBe(false);
    });
  });
});
