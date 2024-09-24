import { CheckboxValue } from "~/components/inputs/Checkbox";
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
        context: { weiterePersonen: [], isWeiterePersonen: "yes" },
      });

      expect(actual).toBe(false);
    });

    it("should return true given isWeiterePersonen yes and weiterePersonen but no unter18JahreAlt", () => {
      const actual = weiterePersonenDone({
        context: {
          isWeiterePersonen: "yes",
          weiterePersonen: [
            {
              title: "",
              ...DEFAULT_WEITERE_PERSONEN_DATA,
              unter18JahreAlt: CheckboxValue.off,
            },
          ],
        },
      });

      expect(actual).toBe(true);
    });

    it("should return true given isWeiterePersonen as yes, weiterePersonen and unter18JahreAlt on with all data for the vertretung included", () => {
      const actual = weiterePersonenDone({
        context: {
          isWeiterePersonen: "yes",
          weiterePersonen: [
            {
              title: "",
              ...DEFAULT_WEITERE_PERSONEN_DATA,
              anrede: "anrede",
              vornameVertretung: "vornameVertretung",
              nachnameVertretung: "nachnameVertretung",
              strasseHausnummerVertretung: "strasseHausnummerVertretung",
              ortVertretung: "ortVertretung",
              plzVertretung: "plzVertretung",
              beschreibenVertretung: "beschreibenVertretung",
            },
          ],
        },
      });

      expect(actual).toBe(true);
    });

    it("should return false given isWeiterePersonen as yes, weiterePersonen and unter18JahreAlt on but missing all vertretung data", () => {
      const actual = weiterePersonenDone({
        context: {
          isWeiterePersonen: "yes",
          weiterePersonen: [
            {
              title: "",
              ...DEFAULT_WEITERE_PERSONEN_DATA,
              unter18JahreAlt: CheckboxValue.on,
            },
          ],
        },
      });

      expect(actual).toBe(false);
    });

    it("should return false given isWeiterePersonen as yes, weiterePersonen and unter18JahreAlt on but missing nachnameVertretung data", () => {
      const actual = weiterePersonenDone({
        context: {
          isWeiterePersonen: "yes",
          weiterePersonen: [
            {
              title: "",
              ...DEFAULT_WEITERE_PERSONEN_DATA,
              vornameVertretung: "vornameVertretung",
              strasseHausnummerVertretung: "strasseHausnummerVertretung",
              ortVertretung: "ortVertretung",
              plzVertretung: "plzVertretung",
              beschreibenVertretung: "beschreibenVertretung",
              unter18JahreAlt: CheckboxValue.on,
            },
          ],
        },
      });

      expect(actual).toBe(false);
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
