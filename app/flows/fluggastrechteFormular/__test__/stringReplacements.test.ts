import type { FluggastrechtContext } from "../context";
import {
  getAirlineName,
  getArrayWeiterePersonenIndexStrings,
  getEndAirportName,
  getFirstZwischenstoppAirportName,
  getPersonNachname,
  getPersonVorname,
  getSecondZwischenstoppAirportName,
  getStartAirportName,
  getThirdZwischenstoppAirportName,
  getWeiterePersonenNameStrings,
  isAnnullierung,
  isNichtBefoerderung,
  isVerspaetet,
} from "../stringReplacements";

describe("stringReplacements", () => {
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
      const context: FluggastrechtContext = {
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
      const context: FluggastrechtContext = {
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

  describe("getAirlineName", () => {
    it("should return the airline name given an exist airline code", () => {
      const context = {
        fluggesellschaft: "LH",
      };

      const actual = getAirlineName(context);

      expect(actual).toStrictEqual({ airlineName: "Deutsche Lufthansa AG" });
    });

    it("should return not airline name given an exist non airline code", () => {
      const context = {
        fluggesellschaft: "XXX",
      };

      const actual = getAirlineName(context);

      expect(actual).toStrictEqual({});
    });

    it("should return an empty given undefined fluggesellschaft", () => {
      const context = {
        fluggesellschaft: undefined,
      };

      const actual = getAirlineName(context);

      expect(actual).toStrictEqual({});
    });
  });

  describe("getFirstZwischenstoppAirportName", () => {
    it("should return the correct name of the first zwischenstopp", () => {
      const actual = getFirstZwischenstoppAirportName({
        ersterZwischenstopp: "BER",
      });
      expect(actual).toStrictEqual({
        firstZwischenstoppAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have first zwischenstopp as parameter", () => {
      const actual = getFirstZwischenstoppAirportName({});
      expect(actual).toStrictEqual({});
    });

    it("should return empty when the first zwischenstopp does not exist in the json file", () => {
      const actual = getFirstZwischenstoppAirportName({
        ersterZwischenstopp: "XXXXX",
      });
      expect(actual).toStrictEqual({});
    });
  });

  describe("getSecondZwischenstoppAirportName", () => {
    it("should return the correct name of the second zwischenstopp", () => {
      const actual = getSecondZwischenstoppAirportName({
        zweiterZwischenstopp: "BER",
      });
      expect(actual).toStrictEqual({
        secondZwischenstoppAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have second zwischenstopp as parameter", () => {
      const actual = getSecondZwischenstoppAirportName({});
      expect(actual).toStrictEqual({});
    });

    it("should return empty when the second zwischenstopp does not exist in the json file", () => {
      const actual = getSecondZwischenstoppAirportName({
        zweiterZwischenstopp: "XXXXX",
      });
      expect(actual).toStrictEqual({});
    });
  });

  describe("getThirdZwischenstoppAirportName", () => {
    it("should return the correct name of the third zwischenstopp", () => {
      const actual = getThirdZwischenstoppAirportName({
        dritterZwischenstopp: "BER",
      });
      expect(actual).toStrictEqual({
        thirdZwischenstoppAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have third zwischenstopp as parameter", () => {
      const actual = getEndAirportName({});
      expect(actual).toStrictEqual({});
    });

    it("should return empty when the third zwischenstopp does not exist in the json file", () => {
      const actual = getEndAirportName({ dritterZwischenstopp: "XXXXX" });
      expect(actual).toStrictEqual({});
    });
  });

  describe("isVerspaetet", () => {
    it("should return isVerspaetet as true if the bereich is verspaetet", () => {
      const actual = isVerspaetet({ bereich: "verspaetet" });

      expect(actual).toStrictEqual({ isVerspaetet: true });
    });

    it("should return isVerspaetet as false if the bereich is not verspaetet", () => {
      const actual = isVerspaetet({ bereich: "nichtbefoerderung" });

      expect(actual).toStrictEqual({ isVerspaetet: false });
    });
  });

  describe("isNichtBefoerderung", () => {
    it("should return isNichtBefoerderung as true if the bereich is nichtbefoerderung", () => {
      const actual = isNichtBefoerderung({
        bereich: "nichtbefoerderung",
      });

      expect(actual).toStrictEqual({ isNichtBefoerderung: true });
    });

    it("should return isNichtBefoerderung as false if the bereich is not nichtbefoerderung", () => {
      const actual = isNichtBefoerderung({
        bereich: "verspaetet",
      });

      expect(actual).toStrictEqual({ isNichtBefoerderung: false });
    });
  });

  describe("isAnnullierung", () => {
    it("should return isAnnullierung as true if the bereich is annullierung", () => {
      const actual = isAnnullierung({
        bereich: "annullierung",
      });

      expect(actual).toStrictEqual({ isAnnullierung: true });
    });

    it("should return isAnnullierung as false if the bereich is not annullierung", () => {
      const actual = isAnnullierung({
        bereich: "verspaetet",
      });

      expect(actual).toStrictEqual({ isAnnullierung: false });
    });
  });
});
