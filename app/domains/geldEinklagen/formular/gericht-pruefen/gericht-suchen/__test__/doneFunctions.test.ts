import { type GeldEinklagenFormularGerichtPruefenUserData } from "../../userData";
import { doneGerichtSuchen } from "../doneFunctions";
import {
  shouldVisitGerichtSuchePostleitzahlKlagendePerson,
  shouldVisitGerichtSuchePostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchePostleitzahlWohnraum,
} from "../guards";

vi.mock("../guards");

const mockShouldVisitGerichtSuchePostleitzahlWohnraum = (
  returnValue = false,
) => {
  vi.mocked(shouldVisitGerichtSuchePostleitzahlWohnraum).mockReturnValue(
    returnValue,
  );
};

const mockShouldVisitGerichtSuchePostleitzahlKlagendePerson = (
  returnValue = false,
) => {
  vi.mocked(shouldVisitGerichtSuchePostleitzahlKlagendePerson).mockReturnValue(
    returnValue,
  );
};

const mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall = (
  returnValue = false,
) => {
  vi.mocked(shouldVisitGerichtSuchePostleitzahlVerkehrsunfall).mockReturnValue(
    returnValue,
  );
};

beforeEach(() => {
  mockShouldVisitGerichtSuchePostleitzahlWohnraum();
  mockShouldVisitGerichtSuchePostleitzahlKlagendePerson();
  mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall();
});

describe("doneGerichtSuchen", () => {
  describe("check cases only need for postleitzahlSecondary", () => {
    const baseContext = {
      gerichtsstandsvereinbarung: "yes",
      postleitzahlSecondary: "someValue",
    } satisfies GeldEinklagenFormularGerichtPruefenUserData;

    it("should return false in case need postleitzahlSecondary is undefined, shouldVisitGerichtSuchePostleitzahlWohnraum is false and gerichtsstandsvereinbarung is yes", () => {
      const context = {
        ...baseContext,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchePostleitzahlWohnraum(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case need postleitzahlSecondary has value, shouldVisitGerichtSuchePostleitzahlWohnraum is false and gerichtsstandsvereinbarung is yes", () => {
      mockShouldVisitGerichtSuchePostleitzahlWohnraum(false);

      const actual = doneGerichtSuchen({ context: baseContext });
      expect(actual).toBe(true);
    });

    it("should return false in case need postleitzahlSecondary is undefined, shouldVisitGerichtSuchePostleitzahlWohnraum is true and gerichtsstandsvereinbarung is no", () => {
      const context = {
        ...baseContext,
        gerichtsstandsvereinbarung: "no" as const,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchePostleitzahlWohnraum(true);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case need postleitzahlSecondary has value, shouldVisitGerichtSuchePostleitzahlWohnraum is true and gerichtsstandsvereinbarung is no", () => {
      const context = {
        ...baseContext,
        gerichtsstandsvereinbarung: "no" as const,
      };
      mockShouldVisitGerichtSuchePostleitzahlWohnraum(true);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(true);
    });
  });

  describe("check cases only need for postleitzahlBeklagtePerson", () => {
    const baseContext = {
      sachgebiet: "miete",
      postleitzahlBeklagtePerson: "someValue",
    } satisfies GeldEinklagenFormularGerichtPruefenUserData;

    it("should return false in case postleitzahlBeklagtePerson is undefined", () => {
      const context = {
        ...baseContext,
        postleitzahlBeklagtePerson: undefined,
      };
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case postleitzahlBeklagtePerson has value", () => {
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context: baseContext });
      expect(actual).toBe(true);
    });
  });

  describe("check cases only need for postleitzahlBeklagtePerson and postleitzahlSecondary", () => {
    const baseContext = {
      sachgebiet: "miete",
      postleitzahlBeklagtePerson: "someValue",
      postleitzahlSecondary: "someValue",
    } satisfies GeldEinklagenFormularGerichtPruefenUserData;

    it("should return false in case postleitzahlBeklagtePerson is undefined and mockShouldVisitGerichtSuchePostleitzahlKlagendePerson is true", () => {
      const context = {
        ...baseContext,
        postleitzahlBeklagtePerson: undefined,
      };
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(true);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return false in case postleitzahlSecondary is undefined and mockShouldVisitGerichtSuchePostleitzahlKlagendePerson is true", () => {
      const context = {
        ...baseContext,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(true);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case postleitzahlBeklagtePerson and postleitzahlSecondary contains value and mockShouldVisitGerichtSuchePostleitzahlKlagendePerson is true", () => {
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(true);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context: baseContext });
      expect(actual).toBe(true);
    });

    it("should return false in case postleitzahlBeklagtePerson is undefined and mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall is true", () => {
      const context = {
        ...baseContext,
        postleitzahlBeklagtePerson: undefined,
      };
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(true);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return false in case postleitzahlSecondary is undefined and mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall is true", () => {
      const context = {
        ...baseContext,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(true);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case postleitzahlBeklagtePerson and postleitzahlSecondary contains value and mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall is true", () => {
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(true);

      const actual = doneGerichtSuchen({ context: baseContext });
      expect(actual).toBe(true);
    });

    it("should return false in case postleitzahlBeklagtePerson is undefined and sachgebiete is schaden", () => {
      const context = {
        ...baseContext,
        sachgebiet: "schaden" as const,
        postleitzahlBeklagtePerson: undefined,
      };
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return false in case postleitzahlSecondary is undefined and sachgebiete is schaden", () => {
      const context = {
        ...baseContext,
        sachgebiet: "schaden" as const,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case postleitzahlBeklagtePerson and postleitzahlSecondary contains value and sachgebiete is schaden", () => {
      const context = {
        ...baseContext,
        sachgebiet: "schaden" as const,
      };
      mockShouldVisitGerichtSuchePostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchePostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(true);
    });
  });
});
