import {
  antragstellendePersonDone,
  couldLiveFromUnterhalt,
  unterhaltBekommeIch,
  unterhaltLeisteIch,
} from "~/flows/prozesskostenhilfe/prozesskostenhilfeFormular/antragstellendePerson/context";

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
    it("should return true if the user pays Unterhalt", () => {
      expect(
        antragstellendePersonDone({ context: { empfaenger: "anderePerson" } }),
      ).toBe(true);
    });

    it("should return true if the user doesn't have a claim to unterhalt", () => {
      expect(
        antragstellendePersonDone({ context: { unterhaltsanspruch: "keine" } }),
      ).toBe(true);
    });

    it("should return true if the user has a claim to unterhalt, has entered an unterhalt sum, and does not live primarily it", () => {
      expect(
        antragstellendePersonDone({
          context: {
            unterhaltsanspruch: "unterhalt",
            unterhaltssumme: "100",
            livesPrimarilyFromUnterhalt: "no",
          },
        }),
      ).toBe(true);
    });

    it("should return true if the user has a claim to unterhalt, lives primarily from it, and has entered all details relating to it", () => {
      expect(
        antragstellendePersonDone({
          context: {
            unterhaltsanspruch: "unterhalt",
            unterhaltssumme: "100",
            livesPrimarilyFromUnterhalt: "yes",
            unterhaltspflichtigePerson: {
              beziehung: "exEhepartner",
              nachname: "Mustermann",
              vorname: "Max",
            },
          },
        }),
      ).toBe(true);
    });

    it("should return true if the user has an unpaid claim to unterhalt, and could not live from it", () => {
      expect(
        antragstellendePersonDone({
          context: {
            unterhaltsanspruch: "anspruchNoUnterhalt",
            couldLiveFromUnterhalt: "no",
          },
        }),
      ).toBe(true);
    });

    it("should return true if the user has an unpaid claim to unterhalt, could live from it, and has filled out all details about it", () => {
      expect(
        antragstellendePersonDone({
          context: {
            unterhaltsanspruch: "anspruchNoUnterhalt",
            couldLiveFromUnterhalt: "yes",
            personWhoCouldPayUnterhaltBeziehung: "exEhepartnerin",
            whyNoUnterhalt: "Keine Lust",
          },
        }),
      ).toBe(true);
    });
  });
});
