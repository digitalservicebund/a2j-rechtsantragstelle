import { type GeldEinklagenFormularGerichtPruefenUserData } from "../../userData";
import {
  shouldVisitGerichtSuchePostleitzahlKlagendePerson,
  shouldVisitGerichtSuchePostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchePostleitzahlWohnraum,
} from "../guards";

describe("guards", () => {
  describe("shouldVisitGerichtSuchePostleitzahlKlagendePerson", () => {
    describe("check klagendeHaustuergeschaeft", () => {
      const baseContext = {
        klagendeHaustuergeschaeft: "yes",
      } satisfies GeldEinklagenFormularGerichtPruefenUserData;

      it("should return false in case klagendeHaustuergeschaeft is no", () => {
        const context = {
          ...baseContext,
          sachgebiet: "miete" as const,
          klagendeHaustuergeschaeft: "no" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return false in case sachgebiet is schaden", () => {
        const context = {
          ...baseContext,
          sachgebiet: "schaden" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return false in case sachgebiet is verkehrsunfall", () => {
        const context = {
          ...baseContext,
          sachgebiet: "verkehrsunfall" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return true in case sachgebiet is miete", () => {
        const context = {
          ...baseContext,
          sachgebiet: "miete" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case sachgebiet is reisen", () => {
        const context = {
          ...baseContext,
          sachgebiet: "reisen" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case sachgebiet is anderesRechtsproblem", () => {
        const context = {
          ...baseContext,
          sachgebiet: "anderesRechtsproblem" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case sachgebiet is urheberrecht and gegenWenBeklagen is organisation", () => {
        const context = {
          ...baseContext,
          sachgebiet: "urheberrecht" as const,
          gegenWenBeklagen: "organisation" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return false in case sachgebiet is urheberrecht, gegenWenBeklagen is person and beklagtePersonGeldVerdienen is no", () => {
        const context = {
          ...baseContext,
          sachgebiet: "urheberrecht" as const,
          gegenWenBeklagen: "person" as const,
          beklagtePersonGeldVerdienen: "no" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return true in case sachgebiet is urheberrecht, gegenWenBeklagen is person and beklagtePersonGeldVerdienen is yes", () => {
        const context = {
          ...baseContext,
          sachgebiet: "urheberrecht" as const,
          gegenWenBeklagen: "person" as const,
          beklagtePersonGeldVerdienen: "yes" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });
    });

    describe("check versicherung", () => {
      const baseContext = {
        sachgebiet: "versicherung" as const,
        versicherungsnummer: "yes" as const,
        klagendeKaufmann: "yes" as const,
        beklagtePersonKaufmann: "yes" as const,
        gerichtsstandsvereinbarung: "yes" as const,
      } satisfies GeldEinklagenFormularGerichtPruefenUserData;

      it("should return false in case versicherungsnummer is no", () => {
        const context = {
          ...baseContext,
          versicherungsnummer: "no" as const,
          klagendeKaufmann: "no" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return true in case klagendeKaufmann is no", () => {
        const context = {
          ...baseContext,
          klagendeKaufmann: "no" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case beklagtePersonKaufmann is no", () => {
        const context = {
          ...baseContext,
          beklagtePersonKaufmann: "no" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case gerichtsstandsvereinbarung is no", () => {
        const context = {
          ...baseContext,
          gerichtsstandsvereinbarung: "no" as const,
        };

        const actual = shouldVisitGerichtSuchePostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });
    });
  });

  describe("shouldVisitGerichtSuchePostleitzahlVerkehrsunfall", () => {
    const baseContext = {
      sachgebiet: "verkehrsunfall",
      verkehrsunfallStrassenverkehr: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
    } satisfies GeldEinklagenFormularGerichtPruefenUserData;

    it("should return false in case sachgebiet is not verkehrsunfall", () => {
      const context = {
        ...baseContext,
        sachgebiet: "versicherung" as const,
        klagendeKaufmann: "no" as const,
      };

      const actual = shouldVisitGerichtSuchePostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false in case verkehrsunfallStrassenverkehr is no", () => {
      const context = {
        ...baseContext,
        verkehrsunfallStrassenverkehr: "no" as const,
        klagendeKaufmann: "no" as const,
      };

      const actual = shouldVisitGerichtSuchePostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return true in case klagendeKaufmann is no", () => {
      const context = {
        ...baseContext,
        klagendeKaufmann: "no" as const,
      };

      const actual = shouldVisitGerichtSuchePostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(true);
    });

    it("should return true in case beklagtePersonKaufmann is no", () => {
      const context = {
        ...baseContext,
        beklagtePersonKaufmann: "no" as const,
      };

      const actual = shouldVisitGerichtSuchePostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(true);
    });

    it("should return true in case gerichtsstandsvereinbarung is no", () => {
      const context = {
        ...baseContext,
        gerichtsstandsvereinbarung: "no" as const,
      };

      const actual = shouldVisitGerichtSuchePostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(true);
    });
  });

  describe("shouldVisitGerichtSuchePostleitzahlWohnraum", () => {
    const baseContext = {
      sachgebiet: "miete",
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
    } satisfies GeldEinklagenFormularGerichtPruefenUserData;

    it("should return false if sachgebiet is not miete", () => {
      const context = {
        ...baseContext,
        sachgebiet: "versicherung" as const,
      };

      const actual = shouldVisitGerichtSuchePostleitzahlWohnraum({ context });

      expect(actual).toBe(false);
    });

    it("should return false if mietePachtVertrag is no", () => {
      const context = {
        ...baseContext,
        mietePachtVertrag: "no" as const,
      };

      const actual = shouldVisitGerichtSuchePostleitzahlWohnraum({ context });

      expect(actual).toBe(false);
    });

    it("should return false if mietePachtRaum is no", () => {
      const context = {
        ...baseContext,
        mietePachtRaum: "no" as const,
      };

      const actual = shouldVisitGerichtSuchePostleitzahlWohnraum({ context });

      expect(actual).toBe(false);
    });

    it("should return true is sachgebiet is miete and mietePachtVertrag and mietePachtRaum are yes", () => {
      const actual = shouldVisitGerichtSuchePostleitzahlWohnraum({
        context: baseContext,
      });

      expect(actual).toBe(true);
    });
  });
});
