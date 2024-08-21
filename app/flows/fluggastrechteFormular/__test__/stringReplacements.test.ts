import { CheckboxValue } from "~/components/inputs/Checkbox";
import { FluggastrechtContext } from "../context";
import {
  getArrayWeiterePersonenIndexStrings,
  getEndAirportName,
  getStartAirportName,
  getWeiterePersonenNameStrings,
} from "../stringReplacements";

describe("stringReplacements", () => {
  describe("getArrayWeiterePersonenIndexStrings", () => {
    it("returns an array weitere personen index for given context", () => {
      const context = {
        pageData: {
          arrayIndexes: [3],
        },
      };

      const arrayIndexStrings = getArrayWeiterePersonenIndexStrings(context);

      expect(arrayIndexStrings).toEqual({ "arrayWeiterePersonen#index": "5" });
    });

    it("returns an empty object for given context when arrayWeiterePersonen are not passed", () => {
      const arrayIndexStrings = getArrayWeiterePersonenIndexStrings({});

      expect(arrayIndexStrings).toEqual({});
    });
  });

  describe("getWeiterePersonenNameStrings", () => {
    it("returns vorname and nachname for given context", () => {
      const context: FluggastrechtContext = {
        weiterePersonen: [
          {
            title: "",
            vorname: "vorname",
            nachname: "nachme",
            strasseHausnummer: "strasseHausnummer",
            ort: "ort",
            plz: "plz",
            unter18JahreAlt: CheckboxValue.off,
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

    it("returns an empty object when arrayIndex is too high", () => {
      const context: FluggastrechtContext = {
        weiterePersonen: [
          {
            title: "",
            vorname: "vorname",
            nachname: "nachme",
            strasseHausnummer: "strasseHausnummer",
            ort: "ort",
            plz: "plz",
            unter18JahreAlt: CheckboxValue.off,
          },
        ],
        pageData: {
          arrayIndexes: [5],
        },
      };

      const weiterePersonenNameStrings = getWeiterePersonenNameStrings(context);

      expect(weiterePersonenNameStrings).toEqual({});
    });

    it("returns an empty object for given context when arrayIndexes missing", () => {
      const weiterePersonenNameStrings = getWeiterePersonenNameStrings({});

      expect(weiterePersonenNameStrings).toEqual({});
    });

    it("returns an empty object for given context when kinder is undefined", () => {
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

  describe("getStartAirportName", () => {
    it("should return the correct name of the airport", () => {
      const actual = getStartAirportName({ startAirport: "BER" });
      expect(actual).toStrictEqual({
        startAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have airport as parameter", () => {
      const actual = getStartAirportName({});
      expect(actual).toStrictEqual({});
    });

    it("should return empty when the airport does not exist in the json file", () => {
      const actual = getStartAirportName({ startAirport: "XXXXX" });
      expect(actual).toStrictEqual({});
    });
  });

  describe("getEndAirportName", () => {
    it("should return the correct name of the airport", () => {
      const actual = getEndAirportName({ endAirport: "BER" });
      expect(actual).toStrictEqual({
        endAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have airport as parameter", () => {
      const actual = getEndAirportName({});
      expect(actual).toStrictEqual({});
    });

    it("should return empty when the airport does not exist in the json file", () => {
      const actual = getEndAirportName({ endAirport: "XXXXX" });
      expect(actual).toStrictEqual({});
    });
  });
});
