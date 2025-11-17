import { type GeldEinklagenFormularGerichtPruefenUserData } from "../../userData";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "../guards";

describe("guards", () => {
  describe("shouldVisitGerichtSuchenPostleitzahlKlagendePerson", () => {
    describe("check klagendeHaustuergeschaeft", () => {
      const baseContext: GeldEinklagenFormularGerichtPruefenUserData = {
        klagendeHaustuergeschaeft: "yes",
      };

      it("should return false in case klagendeHaustuergeschaeft is no", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          sachgebiet: "miete",
          klagendeHaustuergeschaeft: "no",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return false in case sachgebiet is schaden", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          sachgebiet: "schaden",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return false in case sachgebiet is verkehrsunfall", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          sachgebiet: "verkehrsunfall",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return true in case sachgebiet is miete", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          sachgebiet: "miete",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case sachgebiet is reisen", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          sachgebiet: "reisen",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case sachgebiet is anderesRechtsproblem", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          sachgebiet: "anderesRechtsproblem",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case sachgebiet is urheberrecht and gegenWenBeklagen is organisation", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          sachgebiet: "urheberrecht",
          gegenWenBeklagen: "organisation",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return false in case sachgebiet is urheberrecht, gegenWenBeklagen is person and beklagtePersonGeldVerdienen is no", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          sachgebiet: "urheberrecht",
          gegenWenBeklagen: "person",
          beklagtePersonGeldVerdienen: "no",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return true in case sachgebiet is urheberrecht, gegenWenBeklagen is person and beklagtePersonGeldVerdienen is yes", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          sachgebiet: "urheberrecht",
          gegenWenBeklagen: "person",
          beklagtePersonGeldVerdienen: "yes",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });
    });

    describe("check versicherung", () => {
      const baseContext = {
        sachgebiet: "versicherung",
        versicherungsnehmer: "yes",
        klagendeKaufmann: "yes",
        beklagtePersonKaufmann: "yes",
        gerichtsstandsvereinbarung: "yes",
      } satisfies GeldEinklagenFormularGerichtPruefenUserData;

      it("should return false in case versicherungsnehmer is no", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          versicherungsnehmer: "no",
          klagendeKaufmann: "no",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(false);
      });

      it("should return true in case klagendeKaufmann is no", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          klagendeKaufmann: "no",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case beklagtePersonKaufmann is no", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          beklagtePersonKaufmann: "no",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });

      it("should return true in case gerichtsstandsvereinbarung is no", () => {
        const context: GeldEinklagenFormularGerichtPruefenUserData = {
          ...baseContext,
          gerichtsstandsvereinbarung: "no",
        };

        const actual = shouldVisitGerichtSuchenPostleitzahlKlagendePerson({
          context,
        });

        expect(actual).toBe(true);
      });
    });
  });

  describe("shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall", () => {
    const baseContext: GeldEinklagenFormularGerichtPruefenUserData = {
      sachgebiet: "verkehrsunfall",
      verkehrsunfallStrassenverkehr: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
    };

    it("should return false in case sachgebiet is not verkehrsunfall", () => {
      const context: GeldEinklagenFormularGerichtPruefenUserData = {
        ...baseContext,
        sachgebiet: "versicherung",
        klagendeKaufmann: "no",
      };

      const actual = shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false in case verkehrsunfallStrassenverkehr is no", () => {
      const context: GeldEinklagenFormularGerichtPruefenUserData = {
        ...baseContext,
        verkehrsunfallStrassenverkehr: "no",
        klagendeKaufmann: "no",
      };

      const actual = shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return true in case klagendeKaufmann is no", () => {
      const context: GeldEinklagenFormularGerichtPruefenUserData = {
        ...baseContext,
        klagendeKaufmann: "no",
      };

      const actual = shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(true);
    });

    it("should return true in case beklagtePersonKaufmann is no", () => {
      const context: GeldEinklagenFormularGerichtPruefenUserData = {
        ...baseContext,
        beklagtePersonKaufmann: "no",
      };

      const actual = shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(true);
    });

    it("should return true in case gerichtsstandsvereinbarung is no", () => {
      const context: GeldEinklagenFormularGerichtPruefenUserData = {
        ...baseContext,
        gerichtsstandsvereinbarung: "no",
      };

      const actual = shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall({
        context,
      });

      expect(actual).toBe(true);
    });
  });

  describe("shouldVisitGerichtSuchenPostleitzahlWohnraum", () => {
    const baseContext: GeldEinklagenFormularGerichtPruefenUserData = {
      sachgebiet: "miete",
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
    };

    it("should return false if sachgebiet is not miete", () => {
      const context: GeldEinklagenFormularGerichtPruefenUserData = {
        ...baseContext,
        sachgebiet: "versicherung",
      };

      const actual = shouldVisitGerichtSuchenPostleitzahlWohnraum({ context });

      expect(actual).toBe(false);
    });

    it("should return false if mietePachtVertrag is no", () => {
      const context: GeldEinklagenFormularGerichtPruefenUserData = {
        ...baseContext,
        mietePachtVertrag: "no",
      };

      const actual = shouldVisitGerichtSuchenPostleitzahlWohnraum({ context });

      expect(actual).toBe(false);
    });

    it("should return false if mietePachtRaum is no", () => {
      const context: GeldEinklagenFormularGerichtPruefenUserData = {
        ...baseContext,
        mietePachtRaum: "no",
      };

      const actual = shouldVisitGerichtSuchenPostleitzahlWohnraum({ context });

      expect(actual).toBe(false);
    });

    it("should return true is sachgebiet is miete and mietePachtVertrag and mietePachtRaum are yes", () => {
      const actual = shouldVisitGerichtSuchenPostleitzahlWohnraum({
        context: baseContext,
      });

      expect(actual).toBe(true);
    });
  });
});
