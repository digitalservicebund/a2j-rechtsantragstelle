import { CheckboxValue } from "~/components/inputs/Checkbox";
import { weiterePersonenDone } from "../navStates";

const DEFAULT_WEITERE_PERSONEN_DATA = {
  vorname: "vorname",
  nachname: "nachname",
  strasseHausnummer: "strasseHausnummer",
  ort: "ort",
  plz: "plz",
};

describe("navStates", () => {
  describe("weiterePersonenDone", () => {
    it("should return true if it does not have any weiterePersonen", () => {
      const actual = weiterePersonenDone({ context: {} });

      expect(actual).toBe(true);
    });

    it("should return true if it has an empty array list for weiterePersonen", () => {
      const actual = weiterePersonenDone({ context: { weiterePersonen: [] } });

      expect(actual).toBe(true);
    });

    it("should return true if it has weiterePersonen but no unter18JahreAlt", () => {
      const actual = weiterePersonenDone({
        context: {
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

    it("should return true if it has weiterePersonen and unter18JahreAlt on with all data for the vertretung included", () => {
      const actual = weiterePersonenDone({
        context: {
          weiterePersonen: [
            {
              title: "",
              ...DEFAULT_WEITERE_PERSONEN_DATA,
              unter18JahreAlt: CheckboxValue.on,
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

    it("should return false if it has weiterePersonen and unter18JahreAlt on but missing all vertretung data", () => {
      const actual = weiterePersonenDone({
        context: {
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

    it("should return false if it has weiterePersonen and unter18JahreAlt on but missing nachnameVertretung data", () => {
      const actual = weiterePersonenDone({
        context: {
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
});
