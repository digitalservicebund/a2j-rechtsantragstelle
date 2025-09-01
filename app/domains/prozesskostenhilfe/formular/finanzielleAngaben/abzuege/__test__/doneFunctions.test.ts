import { abzuegeDone } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/doneFunctions";

describe("Prozesskostenhilfe Finanzielle Angaben Abzuege doneFunctions", () => {
  describe("abzuegeDone", () => {
    it("should return false if the user hasn't entered an arbeitsweg", () => {
      const done = abzuegeDone({ context: {} });
      expect(done).toBe(false);
    });

    it("should return false if the user uses public transport and hasn't entered their monthly costs, or their place of work", () => {
      const done = abzuegeDone({
        context: { arbeitsweg: "publicTransport" },
      });
      expect(done).toBe(false);
    });

    it("should return false if the user uses a private vehicle and hasn't entered their place of work", () => {
      const done = abzuegeDone({
        context: { arbeitsweg: "privateVehicle" },
      });
      expect(done).toBe(false);
    });

    it("should return false if the user has additional work-related costs and hasn't entered them", () => {
      const done = abzuegeDone({
        context: { arbeitsweg: "none", hasArbeitsausgaben: "yes" },
      });
      expect(done).toBe(false);
    });

    it("should return true if the user has completed all required fields for public transport", () => {
      const done = abzuegeDone({
        context: {
          arbeitsweg: "publicTransport",
          monatlicheOPNVKosten: "50",
          arbeitsplatz: {
            strasseHausnummer: "Teststraße 1",
            plz: "12345",
            ort: "Teststadt",
          },
          arbeitsplatzEntfernung: 10,
          hasArbeitsausgaben: "no",
        },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user has completed all required fields for private vehicle", () => {
      const done = abzuegeDone({
        context: {
          arbeitsweg: "privateVehicle",
          arbeitsplatz: {
            strasseHausnummer: "Teststraße 1",
            plz: "12345",
            ort: "Teststadt",
          },
          arbeitsplatzEntfernung: 10,
          hasArbeitsausgaben: "no",
        },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user has completed all required fields for bike/walking", () => {
      const done = abzuegeDone({
        context: {
          arbeitsweg: "bike",
          hasArbeitsausgaben: "no",
        },
      });
      expect(done).toBe(true);
    });
  });
});
