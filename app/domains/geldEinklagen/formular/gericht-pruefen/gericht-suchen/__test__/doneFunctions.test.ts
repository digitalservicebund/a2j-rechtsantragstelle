import { type GeldEinklagenFormularGerichtPruefenUserData } from "../../userData";
import { doneGerichtSuchen } from "../doneFunctions";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "../guards";

vi.mock("../guards");

const mockShouldVisitGerichtSuchenPostleitzahlWohnraum = (
  returnValue = false,
) => {
  vi.mocked(shouldVisitGerichtSuchenPostleitzahlWohnraum).mockReturnValue(
    returnValue,
  );
};

const mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson = (
  returnValue = false,
) => {
  vi.mocked(shouldVisitGerichtSuchenPostleitzahlKlagendePerson).mockReturnValue(
    returnValue,
  );
};

const mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall = (
  returnValue = false,
) => {
  vi.mocked(shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall).mockReturnValue(
    returnValue,
  );
};

beforeEach(() => {
  mockShouldVisitGerichtSuchenPostleitzahlWohnraum();
  mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson();
  mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall();
});

describe("doneGerichtSuchen", () => {
  describe("check cases only need for postleitzahlSecondary", () => {
    const baseContext = {
      gerichtsstandsvereinbarung: "yes",
      postleitzahlSecondary: "someValue",
    } satisfies GeldEinklagenFormularGerichtPruefenUserData;

    it("should return false in case need postleitzahlSecondary is undefined, shouldVisitGerichtSuchenPostleitzahlWohnraum is false and gerichtsstandsvereinbarung is yes", () => {
      const context = {
        ...baseContext,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchenPostleitzahlWohnraum(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case need postleitzahlSecondary has value, shouldVisitGerichtSuchenPostleitzahlWohnraum is false and gerichtsstandsvereinbarung is yes", () => {
      mockShouldVisitGerichtSuchenPostleitzahlWohnraum(false);

      const actual = doneGerichtSuchen({ context: baseContext });
      expect(actual).toBe(true);
    });

    it("should return false in case need postleitzahlSecondary is undefined, shouldVisitGerichtSuchenPostleitzahlWohnraum is true and gerichtsstandsvereinbarung is no", () => {
      const context = {
        ...baseContext,
        gerichtsstandsvereinbarung: "no" as const,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchenPostleitzahlWohnraum(true);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case need postleitzahlSecondary has value, shouldVisitGerichtSuchenPostleitzahlWohnraum is true and gerichtsstandsvereinbarung is no", () => {
      const context = {
        ...baseContext,
        gerichtsstandsvereinbarung: "no" as const,
      };
      mockShouldVisitGerichtSuchenPostleitzahlWohnraum(true);

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
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case postleitzahlBeklagtePerson has value", () => {
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(false);

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

    it("should return false in case postleitzahlBeklagtePerson is undefined and mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson is true", () => {
      const context = {
        ...baseContext,
        postleitzahlBeklagtePerson: undefined,
      };
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(true);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return false in case postleitzahlSecondary is undefined and mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson is true", () => {
      const context = {
        ...baseContext,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(true);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case postleitzahlBeklagtePerson and postleitzahlSecondary contains value and mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson is true", () => {
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(true);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context: baseContext });
      expect(actual).toBe(true);
    });

    it("should return false in case postleitzahlBeklagtePerson is undefined and mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall is true", () => {
      const context = {
        ...baseContext,
        postleitzahlBeklagtePerson: undefined,
      };
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(true);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return false in case postleitzahlSecondary is undefined and mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall is true", () => {
      const context = {
        ...baseContext,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(true);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case postleitzahlBeklagtePerson and postleitzahlSecondary contains value and mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall is true", () => {
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(true);

      const actual = doneGerichtSuchen({ context: baseContext });
      expect(actual).toBe(true);
    });

    it("should return false in case postleitzahlBeklagtePerson is undefined and sachgebiete is schaden", () => {
      const context = {
        ...baseContext,
        sachgebiet: "schaden" as const,
        postleitzahlBeklagtePerson: undefined,
      };
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return false in case postleitzahlSecondary is undefined and sachgebiete is schaden", () => {
      const context = {
        ...baseContext,
        sachgebiet: "schaden" as const,
        postleitzahlSecondary: undefined,
      };
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(false);
    });

    it("should return true in case postleitzahlBeklagtePerson and postleitzahlSecondary contains value and sachgebiete is schaden", () => {
      const context = {
        ...baseContext,
        sachgebiet: "schaden" as const,
      };
      mockShouldVisitGerichtSuchenPostleitzahlKlagendePerson(false);
      mockShouldVisitGerichtSuchenPostleitzahlVerkehrsunfall(false);

      const actual = doneGerichtSuchen({ context });
      expect(actual).toBe(true);
    });
  });
});
