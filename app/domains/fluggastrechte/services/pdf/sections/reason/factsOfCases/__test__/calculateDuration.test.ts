import { calculateDuration } from "../table/calculateDuration";

describe("calculateDuration", () => {
  it("should calculate the correct duration in hours and minutes", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "10.11.2024",
      endTime: "15:30",
    };
    expect(calculateDuration(input)).toBe("3 Stunden und 30 Minuten");
  });

  it("should return '1 Stunde' and '1 Minute' for a duration of exactly 1 hour and 1 minute", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "10.11.2024",
      endTime: "13:01",
    };
    expect(calculateDuration(input)).toBe("1 Stunde und 1 Minute");
  });

  it("should handle durations that cross midnight", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "23:30",
      endDate: "11.11.2024",
      endTime: "01:00",
    };
    expect(calculateDuration(input)).toBe("1 Stunde und 30 Minuten");
  });

  it("should handle multi-day durations", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "10:00",
      endDate: "12.11.2024",
      endTime: "10:00",
    };
    expect(calculateDuration(input)).toBe("48 Stunden");
  });

  it("should return '0 Stunden and X Minuten' for durations under one hour", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "10.11.2024",
      endTime: "12:45",
    };
    expect(calculateDuration(input)).toBe("0 Stunden und 45 Minuten");
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

  it("should handle exactly the same start and end time as 0 Stunden", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "10.11.2024",
      endTime: "12:00",
    };
    expect(calculateDuration(input)).toBe("0 Stunden");
  });

  it("should return '1 Stunde' for exactly one hour duration", () => {
    const input = {
      startDate: "10.11.2024",
      startTime: "12:00",
      endDate: "10.11.2024",
      endTime: "13:00",
    };
    expect(calculateDuration(input)).toBe("1 Stunde");
  });
});
