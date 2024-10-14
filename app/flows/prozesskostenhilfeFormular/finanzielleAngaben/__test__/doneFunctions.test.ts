import {
  partnerBesondersAusgabenDone,
  partnerDone,
  partnerSupportDone,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/doneFunctions";

describe("Finanzielle Angaben doneFunctions", () => {
  describe("partnerDone", () => {
    it("should return true if the user receives grundsicherung or asylbewerberleistungen", () => {
      let done = partnerDone({
        context: { staatlicheLeistungen: "grundsicherung" },
      });
      expect(done).toBe(true);
      done = partnerDone({
        context: { staatlicheLeistungen: "asylbewerberleistungen" },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user doesn't have a partnerschaft", () => {
      let done = partnerDone({
        context: { partnerschaft: "no" },
      });
      expect(done).toBe(true);
      done = partnerDone({
        context: { partnerschaft: "widowed" },
      });
      expect(done).toBe(true);
      done = partnerDone({
        context: { partnerschaft: "separated" },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user's partner receives grundsicherung or asylbewerberleistungen", () => {
      let done = partnerDone({
        context: { "partner-staatlicheLeistungen": "grundsicherung" },
      });
      expect(done).toBe(true);
      done = partnerDone({
        context: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
      });
      expect(done).toBe(true);
    });
  });

  describe("partnerBesondersAusgabenDone", () => {
    it("should return true if the user has no besonders Ausgaben", () => {
      expect(
        partnerBesondersAusgabenDone({
          context: { partnerHasBesondersAusgaben: "no" },
        }),
      ).toBe(true);
    });

    it("should return false if the user has indicated besonders Ausgaben but hasn't entered anything", () => {
      expect(
        partnerBesondersAusgabenDone({
          context: { partnerHasBesondersAusgaben: "yes" },
        }),
      ).toBe(false);
    });

    it("should return true if the user has filled out besonders ausgaben", () => {
      expect(
        partnerBesondersAusgabenDone({
          context: {
            partnerHasBesondersAusgaben: "yes",
            partnerBesondersAusgabe: {
              beschreibung: "hello world",
              betrag: "100",
            },
          },
        }),
      ).toBe(true);
    });
  });

  describe("partnerSupportDone", () => {
    it("should return false if the user hasn't stated yes or no", () => {
      const done = partnerSupportDone({
        context: { "partner-receivesSupport": undefined },
      });
      expect(done).toBe(false);
    });

    it("should return false if the user stated yes but hasn't entered the amount", () => {
      const done = partnerSupportDone({
        context: { "partner-receivesSupport": "yes" },
      });
      expect(done).toBe(false);
    });

    it("should return true if the user's partner doesn't receive a pension", () => {
      const done = partnerSupportDone({
        context: { "partner-receivesSupport": "no" },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user's partner receives a pension and has entered the amount", () => {
      const done = partnerSupportDone({
        context: {
          "partner-receivesSupport": "no",
          "partner-supportAmount": "100",
        },
      });
      expect(done).toBe(true);
    });
  });
});
