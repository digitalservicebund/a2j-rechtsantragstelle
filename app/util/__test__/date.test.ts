import {
  addDays,
  addYears,
  dateUTCFromGermanDateString,
  pdfDateFormat,
  toGermanDateFormat,
  today,
} from "../date";

describe("date", () => {
  describe("today()", () => {
    it("should return an instance of Date", () => {
      expect(today()).toBeInstanceOf(Date);
    });
  });

  describe("toGermanDateFormat()", () => {
    it("formats correctly", () => {
      expect(toGermanDateFormat(new Date("2000-01-01"))).toEqual("01.01.2000");
    });
  });

  describe("dateUTCFromGermanDateString()", () => {
    it("parses correctly", () => {
      expect(dateUTCFromGermanDateString("01.01.2000")).toEqual(
        new Date("2000-01-01"),
      );
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
});
