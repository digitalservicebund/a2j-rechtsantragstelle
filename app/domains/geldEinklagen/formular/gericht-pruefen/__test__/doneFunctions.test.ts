import { forderungDone, introDone } from "../doneFunctions";

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

  describe("introDone", () => {
    it("should return false if 'anwaltschaft' is missing", () => {
      const result = introDone({ context: {} });
      expect(result).toBe(false);
    });

    it("should return true if 'anwaltschaft' is present", () => {
      const result = introDone({ context: { anwaltschaft: "yes" } });
      expect(result).toBe(true);
    });
  });
});
