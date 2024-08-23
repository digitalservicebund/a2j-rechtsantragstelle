import { CheckboxValue } from "~/components/inputs/Checkbox";
import { personDone, weiterePersonenDone } from "../navStates";

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

  describe("personDone", () => {
    it("should return false if it is missing person data", () => {
      const actual = personDone({
        context: {},
      });

      expect(actual).toBe(false);
    });

    it("should return false if it is missing vorname in the person data", () => {
      const actual = personDone({
        context: {
          ...PERSONEN_DATA,
          vorname: undefined,
          unter18JahreAlt: CheckboxValue.off,
          isProzessbevollmaechtigte: "no",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return false if it has person data, but is missing vertretung data when unter18JahreAlt is on", () => {
      const actual = personDone({
        context: {
          ...PERSONEN_DATA,
          unter18JahreAlt: CheckboxValue.on,
          isProzessbevollmaechtigte: "no",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return false if it has person data, but is missing prozessbevollmaechtigte data when isProzessbevollmaechtigte is yes", () => {
      const actual = personDone({
        context: {
          ...PERSONEN_DATA,
          unter18JahreAlt: CheckboxValue.off,
          isProzessbevollmaechtigte: "yes",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if has person data, but off unter18JahreAlt and no isProzessbevollmaechtigte", () => {
      const actual = personDone({
        context: {
          ...PERSONEN_DATA,
          unter18JahreAlt: CheckboxValue.off,
          isProzessbevollmaechtigte: "no",
        },
      });

      expect(actual).toBe(true);
    });

    it("should return true if has person data, on unter18JahreAlt with vertretung data and no isProzessbevollmaechtigte", () => {
      const actual = personDone({
        context: {
          ...PERSONEN_DATA,
          unter18JahreAlt: CheckboxValue.on,
          vornameVertretung: "vornameVertretung",
          nachnameVertretung: "nachnameVertretung",
          strasseHausnummerVertretung: "strasseHausnummerVertretung",
          ortVertretung: "ortVertretung",
          plzVertretung: "plzVertretung",
          beschreibenVertretung: "beschreibenVertretung",
          isProzessbevollmaechtigte: "no",
        },
      });

      expect(actual).toBe(true);
    });

    it("should return true if has person data, yes isProzessbevollmaechtigte with Prozessbevollmaechtigte data and off unter18JahreAlt", () => {
      const actual = personDone({
        context: {
          ...PERSONEN_DATA,
          unter18JahreAlt: CheckboxValue.off,
          vornameVollmaechtigte: "vornameVollmaechtigte",
          vollmaechtigteNachname: "vollmaechtigteNachname",
          isProzessbevollmaechtigte: "yes",
        },
      });

      expect(actual).toBe(true);
    });
  });
});