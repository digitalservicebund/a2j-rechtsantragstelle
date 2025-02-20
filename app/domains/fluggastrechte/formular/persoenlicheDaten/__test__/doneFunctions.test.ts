import { personDone, weiterePersonenDone } from "../doneFunctions";

const DEFAULT_WEITERE_PERSONEN_DATA = {
  vorname: "vorname",
  nachname: "nachname",
  strasseHausnummer: "strasseHausnummer",
  ort: "ort",
  plz: "plz",
};

const PERSONEN_DATA = {
  vorname: "vorname",
  nachname: "nachname",
  strasseHausnummer: "strasseHausnummer",
  plz: "plz",
  ort: "ort",
};

describe("navStates", () => {
  describe("weiterePersonenDone", () => {
    it("should return false if it does not have any weiterePersonen", () => {
      const actual = weiterePersonenDone({ context: {} });

      expect(actual).toBe(false);
    });

    it("should return true given isWeiterePersonen as no", () => {
      const actual = weiterePersonenDone({
        context: { isWeiterePersonen: "no" },
      });

      expect(actual).toBe(true);
    });

    it("should return false given isWeiterePersonen as yes and an empty array list for weiterePersonen", () => {
      const actual = weiterePersonenDone({
        context: {
          weiterePersonen: [],
          isWeiterePersonen: "yes",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true given isWeiterePersonen yes and weiterePersonen", () => {
      const actual = weiterePersonenDone({
        context: {
          isWeiterePersonen: "yes",
          weiterePersonen: [
            {
              title: "",
              ...DEFAULT_WEITERE_PERSONEN_DATA,
            },
          ],
        },
      });

      expect(actual).toBe(true);
    });

    it("should return true given isWeiterePersonen yes and weiterePersonen with buchungsnummer", () => {
      const actual = weiterePersonenDone({
        context: {
          isWeiterePersonen: "yes",
          weiterePersonen: [
            {
              title: "",
              ...DEFAULT_WEITERE_PERSONEN_DATA,
            },
            {
              buchungsnummer: "1234567",
              ...DEFAULT_WEITERE_PERSONEN_DATA,
            },
          ],
        },
      });

      expect(actual).toBe(true);
    });
  });

  describe("personDone", () => {
    it("returns false when no personal data is provided", () => {
      const actual = personDone({
        context: {},
      });

      expect(actual).toBe(false);
    });

    it("returns false when required personal data is provided and 'vorname' is missing in the personal data", () => {
      const actual = personDone({
        context: {
          ...PERSONEN_DATA,
          vorname: undefined,
        },
      });

      expect(actual).toBe(false);
    });

    it("returns true when required personal data is provided", () => {
      const actual = personDone({
        context: {
          ...PERSONEN_DATA,
        },
      });

      expect(actual).toBe(true);
    });
  });
});
