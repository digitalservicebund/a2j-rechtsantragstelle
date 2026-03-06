import {
  addDays,
  addYears,
  pdfDateFormat,
  today,
  toGermanDateString,
  toGermanTimeString,
} from "../date";

describe("date", () => {
  describe("today()", () => {
    it("should return an instance of Date", () => {
      expect(today()).toBeInstanceOf(Date);
    });
  });

  describe("addDays()", () => {
    it("adds and subtracts correctly", () => {
      expect(addDays(new Date("2000-01-01"), 1)).toEqual(
        new Date("2000-01-02"),
      );

      expect(addDays(new Date("2000-01-01"), -1)).toEqual(
        new Date("1999-12-31"),
      );
    });
  });

  describe("addYears()", () => {
    it("adds and subtracts correctly", () => {
      expect(addYears(new Date("2000-01-01"), 1)).toEqual(
        new Date("2001-01-01"),
      );

      expect(addYears(new Date("2000-01-01"), -1)).toEqual(
        new Date("1999-01-01"),
      );
    });
  });

  describe("pdfDateFormat()", () => {
    it("formats correctly", () => {
      expect(pdfDateFormat(new Date("2000-01-01"))).toEqual("01_01_2000");
    });
  });

  describe("toGermanDateString", () => {
    it("formats correctly", () => {
      expect(toGermanDateString(new Date("2000-01-01"))).toEqual("01.01.2000");
    });
  });

  describe("toGermanTimeString", () => {
    it("should format time correctly", () => {
      const date = new Date("2025-06-10T12:34:00");
      expect(toGermanTimeString(date)).toBe("12:34");
    });

    it("should pad single digit hours and minutes", () => {
      const date = new Date("2025-06-10T01:05:00");
      expect(toGermanTimeString(date)).toBe("01:05");
    });
  });
});
