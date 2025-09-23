import { forderungDone } from "../doneFunctions";

describe("doneFunctions", () => {
  describe("forderungDone", () => {
    it("should return false if 'forderung' is missing", () => {
      const result = forderungDone({ context: {} });
      expect(result).toBe(false);
    });

    it("should return true if 'forderung' is present", () => {
      const result = forderungDone({ context: { forderung: "etwasAnderes" } });
      expect(result).toBe(true);
    });
  });
});
