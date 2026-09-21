import { weiterePersonenDone } from "../doneFunctions";

const DEFAULT_WEITERE_PERSONEN_DATA = {
  vorname: "vorname",
  nachname: "nachname",
  strasse: "strasse",
  hausnummer: "1",
  ort: "ort",
  plz: "plz",
};

describe("navStates", () => {
  describe("weiterePersonenDone", () => {
    it("should return false if it does not have any weiterePersonen", () => {
      const actual = weiterePersonenDone({});

      expect(actual).toBe(false);
    });

    it("should return true given isWeiterePersonen as no", () => {
      const actual = weiterePersonenDone({ isWeiterePersonen: "no" });

      expect(actual).toBe(true);
    });

    it("should return false given isWeiterePersonen as yes and an empty array list for weiterePersonen", () => {
      const actual = weiterePersonenDone({
        weiterePersonen: [],
        isWeiterePersonen: "yes",
      });

      expect(actual).toBe(false);
    });

    it("should return true given isWeiterePersonen yes and weiterePersonen", () => {
      const actual = weiterePersonenDone({
        isWeiterePersonen: "yes",
        weiterePersonen: [
          {
            title: "none",
            ...DEFAULT_WEITERE_PERSONEN_DATA,
          },
        ],
      });

      expect(actual).toBe(true);
    });

    it("should return true given isWeiterePersonen yes and weiterePersonen with buchungsnummer", () => {
      const actual = weiterePersonenDone({
        isWeiterePersonen: "yes",
        weiterePersonen: [
          {
            title: "none",
            ...DEFAULT_WEITERE_PERSONEN_DATA,
          },
          {
            buchungsnummer: "1234567",
            ...DEFAULT_WEITERE_PERSONEN_DATA,
          },
        ],
      });

      expect(actual).toBe(true);
    });
  });
});
