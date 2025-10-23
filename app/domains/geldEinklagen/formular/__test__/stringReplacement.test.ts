import { isBeklagtePerson } from "../stringReplacements";

describe("stringReplacement", () => {
  describe("isBeklagtePerson", () => {
    it("should return true in case fuerWenBeklagen is person", () => {
      const context = {
        fuerWenBeklagen: "person" as const,
      };

      const actual = isBeklagtePerson(context);
      expect(actual.isBeklagtePerson).toBe(true);
    });

    it("should return false in case fuerWenBeklagen is organisation", () => {
      const context = {
        fuerWenBeklagen: "organisation" as const,
      };

      const actual = isBeklagtePerson(context);
      expect(actual.isBeklagtePerson).toBe(false);
    });

    it("should return false in case fuerWenBeklagen is undefined", () => {
      const context = {
        fuerWenBeklagen: undefined,
      };

      const actual = isBeklagtePerson(context);
      expect(actual.isBeklagtePerson).toBe(false);
    });
  });
});
