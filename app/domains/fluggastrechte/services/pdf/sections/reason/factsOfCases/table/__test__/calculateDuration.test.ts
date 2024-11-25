import { calculateDuration } from "../calculateDuration";

describe("calculateDuration", () => {
  it("should calculate the correct duration in days, hours, and minutes (singular)", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "11.11.2024",
      endTime: "13:01",
    };
    expect(calculateDuration(input)).toBe("1 Tag, 1 Stunde, 1 Minute");
  });

  it("should calculate the correct duration in days, hours, and minutes (plural)", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "12.11.2024",
      endTime: "14:30",
    };
    expect(calculateDuration(input)).toBe("2 Tage, 2 Stunden, 30 Minuten");
  });

  it("should handle exactly one day duration", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "11.11.2024",
      endTime: "12:00",
    };
    expect(calculateDuration(input)).toBe("1 Tag");
  });

  it("should handle a duration with no minutes", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "11.11.2024",
      endTime: "14:00",
    };
    expect(calculateDuration(input)).toBe("1 Tag, 2 Stunden");
  });

  it("should return the hour for exactly one hour duration", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "10.11.2024",
      endTime: "13:00",
    };
    expect(calculateDuration(input)).toBe("1 Stunde");
  });

  it("should return minutes for durations under one hour", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "10.11.2024",
      endTime: "12:45",
    };
    expect(calculateDuration(input)).toBe("45 Minuten");
  });

  it("should handle durations over multiple days without hours and minutes", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "00:00",
      endDate: "13.11.2024",
      endTime: "00:00",
    };
    expect(calculateDuration(input)).toBe("3 Tage");
  });

  it("should return empty string if end time is before start time on the same day", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "15:00",
      endDate: "10.11.2024",
      endTime: "12:00",
    };
    expect(calculateDuration(input)).toBe("");
  });

  it("should return empty string for end date before start date", () => {
    const input = {
      startDate: "11.11.2024",
      startTime: "10:00",
      endDate: "10.11.2024",
      endTime: "10:00",
    };
    expect(calculateDuration(input)).toBe("");
  });
});
