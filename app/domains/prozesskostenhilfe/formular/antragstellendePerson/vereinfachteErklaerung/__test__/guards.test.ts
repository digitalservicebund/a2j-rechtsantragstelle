import {
  childLivesSeparately,
  famFG,
  geringesEinkommen,
  hasEinnahmen,
  hasEinnahmenAndEmptyArray,
  hasVermoegen,
  keinEinkommen,
  minderjaehrig,
  unterhaltsOrAbstammungssachen,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";

describe("guards", () => {
  describe("childLivesSeparately", () => {
    it("should return true if the user's child lives separately", () => {
      expect(
        childLivesSeparately({
          context: {
            livesTogether: "no",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user's child lives with them", () => {
      expect(
        childLivesSeparately({
          context: {
            livesTogether: "yes",
          },
        }),
      ).toBe(false);
    });
  });

  describe("minderjaehrig", () => {
    it("should return true if the user's child is underage", () => {
      expect(
        minderjaehrig({
          context: {
            minderjaehrig: "yes",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user's child is an adult", () => {
      expect(
        minderjaehrig({
          context: {
            minderjaehrig: "no",
          },
        }),
      ).toBe(false);
    });
  });

  describe("hasEinnahmen", () => {
    it("should return true if the user's child has einnahmen", () => {
      expect(
        hasEinnahmen({
          context: {
            hasEinnahmen: "yes",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user's child has no einnahmen", () => {
      expect(
        hasEinnahmen({
          context: {
            hasEinnahmen: "no",
          },
        }),
      ).toBe(false);
    });
  });

  describe("hasEinnahmenAndEmptyArray", () => {
    it("should return true if the user's child has einnahmen but the einnahmen array is empty", () => {
      expect(
        hasEinnahmenAndEmptyArray({
          context: {
            hasEinnahmen: "yes",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user's child has einnahmen with entries for each", () => {
      expect(
        hasEinnahmenAndEmptyArray({
          context: {
            hasEinnahmen: "no",
            einnahmen: [
              {
                betrag: "100",
                beschreibung: "Test",
                zahlungsfrequenz: "monthly",
              },
            ],
          },
        }),
      ).toBe(false);
    });
  });

  describe("hasVermoegen", () => {
    it("should return true if the user's child has Vermoegen", () => {
      expect(
        hasVermoegen({
          context: {
            hasVermoegen: "yes",
          },
        }),
      ).toBe(true);
    });
    it("should return false if the user's child has no Vermoegen", () => {
      expect(
        hasVermoegen({
          context: {
            hasVermoegen: "no",
          },
        }),
      ).toBe(false);
    });
  });

  describe("FamFG", () => {
    it("should return true if the criteria for FamFG is met", () => {
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "yes",
            rechtlichesThema: "unterhalt",
          },
        }),
      ).toBe(true);
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "yes",
            rechtlichesThema: "vollstreckung",
          },
        }),
      ).toBe(true);
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "yes",
            rechtlichesThema: "abstammung",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the criteria for FamFG is not met", () => {
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "no",
            rechtlichesThema: "unterhalt",
          },
        }),
      ).toBe(false);
      expect(
        famFG({
          context: {
            unterhaltsOrAbstammungssachen: "yes",
            rechtlichesThema: "other",
          },
        }),
      ).toBe(false);
    });
  });

  describe("geringesEinkommen", () => {
    it("should return true if the user's child has low income (<619€)", () => {
      expect(
        geringesEinkommen({
          context: {
            hohesEinkommen: "no",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the user's child has high income (>619€)", () => {
      expect(
        geringesEinkommen({
          context: {
            hohesEinkommen: "yes",
          },
        }),
      ).toBe(false);
    });
  });

  describe("keinEinkommen", () => {
    it("should return true if the user's child has no income", () => {
      expect(
        keinEinkommen({
          context: {
            hasEinnahmen: "no",
          },
        }),
      ).toBe(true);
    });
    it("should return false if the user's child has income", () => {
      expect(
        keinEinkommen({
          context: {
            hasEinnahmen: "yes",
          },
        }),
      ).toBe(false);
    });
  });

  describe("unterhaltsOrAbstammungssachen", () => {
    it("should return true if the issue is about unterhalt or abstammung", () => {
      expect(
        unterhaltsOrAbstammungssachen({
          context: {
            unterhaltsOrAbstammungssachen: "yes",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the issue is not about unterhalt or abstammung", () => {
      expect(
        unterhaltsOrAbstammungssachen({
          context: {
            unterhaltsOrAbstammungssachen: "no",
          },
        }),
      ).toBe(false);
    });
  });
});
