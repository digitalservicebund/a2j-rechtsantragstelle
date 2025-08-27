import { finanzielleAngabeAbzuegeGuards as guards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/guards";

describe("Prozesskostenhilfe Finanzielle Angaben Abzuege guards", () => {
  describe("usesPublicTransit", () => {
    it("should return true if the user uses public transit for work", () => {
      expect(
        guards.usesPublicTransit({
          context: { arbeitsweg: "publicTransport" },
        }),
      ).toBe(true);
    });

    it("should return false if the user doesn't use public transit", () => {
      expect(
        guards.usesPublicTransit({
          context: { arbeitsweg: "privateVehicle" },
        }),
      ).toBe(false);
    });
  });

  describe("usesPrivateVehicle", () => {
    it("should return true if the user uses a private vehicle for work", () => {
      expect(
        guards.usesPrivateVehicle({
          context: { arbeitsweg: "privateVehicle" },
        }),
      ).toBe(true);
    });

    it("should return false if the user doesn't use a private vehicle", () => {
      expect(
        guards.usesPrivateVehicle({
          context: { arbeitsweg: "publicTransport" },
        }),
      ).toBe(false);
    });
  });

  describe("commuteMethodPlaysNoRole", () => {
    it("should return true if the user uses bike", () => {
      expect(
        guards.commuteMethodPlaysNoRole({
          context: { arbeitsweg: "bike" },
        }),
      ).toBe(true);
    });

    it("should return true if the user walks", () => {
      expect(
        guards.commuteMethodPlaysNoRole({
          context: { arbeitsweg: "walking" },
        }),
      ).toBe(true);
    });

    it("should return false if the user uses public transport", () => {
      expect(
        guards.commuteMethodPlaysNoRole({
          context: { arbeitsweg: "publicTransport" },
        }),
      ).toBe(false);
    });
  });

  describe("hasAndereArbeitsausgaben", () => {
    it("should return true if the user has additional work-related expenses", () => {
      expect(
        guards.hasAndereArbeitsausgaben({
          context: { hasArbeitsausgaben: "yes" },
        }),
      ).toBe(true);
    });

    it("should return false if the user doesn't have additional work-related expenses", () => {
      expect(
        guards.hasAndereArbeitsausgaben({
          context: { hasArbeitsausgaben: "no" },
        }),
      ).toBe(false);
    });
  });

  describe("hasAndereArbeitsausgabenAndEmptyArray", () => {
    it("should return true if the user has additional work-related expenses but hasn't entered them", () => {
      expect(
        guards.hasAndereArbeitsausgabenAndEmptyArray({
          context: { hasArbeitsausgaben: "yes", arbeitsausgaben: [] },
        }),
      ).toBe(true);
    });

    it("should return false if the user has additional work-related expenses and has entered them", () => {
      expect(
        guards.hasAndereArbeitsausgabenAndEmptyArray({
          context: {
            hasArbeitsausgaben: "yes",
            arbeitsausgaben: [
              {
                beschreibung: "Test",
                betrag: "100",
                zahlungsfrequenz: "monthly",
              },
            ],
          },
        }),
      ).toBe(false);
    });
  });
});
