import { getAirlineName } from "../airline";

describe("airline", () => {
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
});
