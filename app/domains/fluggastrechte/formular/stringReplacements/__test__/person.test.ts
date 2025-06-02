import { type FluggastrechteUserData } from "../../userData";
import {
  getArrayWeiterePersonenIndexStrings,
  getPersonNachname,
  getPersonVorname,
  getWeiterePersonenNameStrings,
  isWeiterePersonen,
} from "../person";

describe("person", () => {
  describe("getArrayWeiterePersonenIndexStrings", () => {
    it("should return an array weitere personen index for given context", () => {
      const context = {
        pageData: {
          arrayIndexes: [3],
        },
      };

      const arrayIndexStrings = getArrayWeiterePersonenIndexStrings(context);

      expect(arrayIndexStrings).toEqual({ "arrayWeiterePersonen#index": "5" });
    });

    it("should return an empty object for given context when arrayWeiterePersonen are not passed", () => {
      const arrayIndexStrings = getArrayWeiterePersonenIndexStrings({});

      expect(arrayIndexStrings).toEqual({});
    });
  });

  describe("getWeiterePersonenNameStrings", () => {
    it("should return vorname and nachname for given context", () => {
      const context: FluggastrechteUserData = {
        weiterePersonen: [
          {
            title: "",
            vorname: "vorname",
            nachname: "nachname",
            strasseHausnummer: "strasseHausnummer",
            ort: "ort",
            plz: "plz",
          },
        ],
        pageData: {
          arrayIndexes: [0],
        },
      };

      const weiterePersonenNameStrings = getWeiterePersonenNameStrings(context);

      expect(weiterePersonenNameStrings).toEqual({
        "weiterePersonen#vorname": context.weiterePersonen?.[0].vorname,
        "weiterePersonen#nachname": context.weiterePersonen?.[0].nachname,
      });
    });

    it("should return an empty object when arrayIndex is too high", () => {
      const context: FluggastrechteUserData = {
        weiterePersonen: [
          {
            title: "",
            vorname: "vorname",
            nachname: "nachname",
            strasseHausnummer: "strasseHausnummer",
            ort: "ort",
            plz: "plz",
          },
        ],
        pageData: {
          arrayIndexes: [5],
        },
      };

      const weiterePersonenNameStrings = getWeiterePersonenNameStrings(context);

      expect(weiterePersonenNameStrings).toEqual({});
    });

    it("should return an empty object for given context when arrayIndexes missing", () => {
      const weiterePersonenNameStrings = getWeiterePersonenNameStrings({});

      expect(weiterePersonenNameStrings).toEqual({});
    });

    it("should return an empty object for given context when kinder is undefined", () => {
      const context = {
        weiterePersonen: undefined,
        pageData: {
          arrayIndexes: [3],
        },
      };

      const weiterePersonenNameStrings = getWeiterePersonenNameStrings(context);

      expect(weiterePersonenNameStrings).toEqual({});
    });
  });

  describe("getPersonVorname", () => {
    it("should return the person vorname for a given context", () => {
      const context = {
        vorname: "vorname",
      };

      const actual = getPersonVorname(context);

      expect(actual).toEqual({ personVorname: context.vorname });
    });
  });

  describe("getPersonNachname", () => {
    it("should return the person nachname for a given context", () => {
      const context = {
        nachname: "nachname",
      };

      const actual = getPersonNachname(context);

      expect(actual).toEqual({ personNachname: context.nachname });
    });
  });

  describe("isWeiterePersonen", () => {
    it("should return isWeiterePersonen as true if the isWeiterePersonen is yes", () => {
      const actual = isWeiterePersonen({
        isWeiterePersonen: "yes",
      });

      expect(actual).toStrictEqual({ isWeiterePersonen: true });
    });

    it("should return isWeiterePersonen as false if the isWeiterePersonen is no", () => {
      const actual = isWeiterePersonen({
        isWeiterePersonen: "no",
      });

      expect(actual).toStrictEqual({ isWeiterePersonen: false });
    });
  });
});
