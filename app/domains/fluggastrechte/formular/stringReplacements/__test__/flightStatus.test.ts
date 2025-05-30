import { type FluggastrechteUserData } from "../../userData";
import {
  getAnnullierungInfo,
  isAnnullierung,
  isNichtBefoerderung,
  isVerspaetet,
} from "../flightStatus";

describe("flightStatus", () => {
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

  describe("getAnnullierungInfo", () => {
    it("should return correct annullierung info based on context", () => {
      const context: FluggastrechteUserData = {
        ersatzflugStartenEinStunde: "yes",
        ersatzflugLandenZweiStunden: "yes",
      };

      const result = getAnnullierungInfo(context);

      expect(result).toEqual({
        hasAnnullierungCase: false,
        hasBetween7And13DaysAnkuendigung: false,
        hasErsatzflugLandenVierStunden: false,
        hasErsatzflugLandenZweiStunden: true,
        hasErsatzflugStartenEinStunde: true,
        hasErsatzflugStartenZweiStunden: false,
        hasErsatzverbindungAngebot: false,
        hasMoreThan13DaysAnkuendigung: false,
        hasNoAnkuendigung: false,
        hasUntil6DaysAnkuendigung: false,
      });
    });
  });
});
