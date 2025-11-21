import { hasClaimVertrag, isBeklagtePerson } from "../stringReplacements";

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
});
