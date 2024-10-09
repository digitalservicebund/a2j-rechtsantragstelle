import {
  antragstellendePersonDone,
  couldLiveFromUnterhalt,
  unterhaltBekommeIch,
  unterhaltLeisteIch,
} from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/context";

describe("PKH Antragstellende Person Context", () => {
  describe("guards", () => {
    describe("unterhaltLeisteIch", () => {
      it("should return true if the user is filling out the form for someone other than themselves", () => {
        expect(
          unterhaltLeisteIch({
            context: {
              empfaenger: "anderePerson",
            },
          }),
        ).toBe(true);
      });

      it("should return false if the user is filling out the form for themselves", () => {
        expect(
          unterhaltLeisteIch({
            context: {
              empfaenger: "ich",
            },
          }),
        ).toBe(false);
      });

      it("should return false if the user hasn't answered the recipient question", () => {
        expect(
          unterhaltLeisteIch({
            context: {},
          }),
        ).toBe(false);
      });
    });

    describe("unterhaltBekommeIch", () => {
      it("should return true if the user lives primarily from received support", () => {
        expect(
          unterhaltBekommeIch({
            context: { livesPrimarilyFromUnterhalt: "yes" },
          }),
        ).toBe(true);
      });

      it("should return false if the user does NOT live primarily from received support", () => {
        expect(
          unterhaltBekommeIch({
            context: { livesPrimarilyFromUnterhalt: "no" },
          }),
        ).toBe(false);
      });

      it("should return false if the user has not answered whether or not they live primarily from received support", () => {
        expect(
          unterhaltBekommeIch({
            context: {},
          }),
        ).toBe(false);
      });
    });

    describe("couldLiveFromUnterhalt", () => {
      it("should return true if the user could live from received support", () => {
        expect(
          couldLiveFromUnterhalt({
            context: { couldLiveFromUnterhalt: "yes" },
          }),
        ).toBe(true);
      });

      it("should return false if the user could not live from received support", () => {
        expect(
          couldLiveFromUnterhalt({
            context: { couldLiveFromUnterhalt: "no" },
          }),
        ).toBe(false);
      });

      it("should return false if the user has not answered whether or not they could live from received support", () => {
        expect(
          couldLiveFromUnterhalt({
            context: {},
          }),
        ).toBe(false);
      });
    });
  });

  describe("antragstellendePersonDone", () => {
    // TODO: fill out test correctly
    it("should return false", () => {
      expect(antragstellendePersonDone({ context: {} })).toBe(false);
    });
  });
});
