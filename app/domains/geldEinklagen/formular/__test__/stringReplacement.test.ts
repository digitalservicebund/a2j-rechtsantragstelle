import { isBeklagtePerson } from "../stringReplacements";

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
});
