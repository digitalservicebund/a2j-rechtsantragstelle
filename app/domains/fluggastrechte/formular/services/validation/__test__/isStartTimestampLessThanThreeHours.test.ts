import { isStartTimestampLessThanThreeHours } from "../isStartTimestampLessThanThreeHours";

describe("isStartTimestampLessThanThreeHours", () => {
  test("returns true when the time difference is less than three hours", () => {
    const startTimestamp = Date.now();
    const endTimestamp = startTimestamp + 2 * 60 * 60 * 1000; // 2 hours later
    const actual = isStartTimestampLessThanThreeHours(
      startTimestamp,
      endTimestamp,
    );

    expect(actual).toBe(true);
  });

  test("returns false when the time difference is exactly three hours", () => {
    const startTimestamp = Date.now();
    const endTimestamp = startTimestamp + 3 * 60 * 60 * 1000; // Exactly 3 hours later

    const actual = isStartTimestampLessThanThreeHours(
      startTimestamp,
      endTimestamp,
    );

    expect(actual).toBe(false);
  });

  test("returns false when the time difference is more than three hours", () => {
    const startTimestamp = Date.now();
    const endTimestamp = startTimestamp + 4 * 60 * 60 * 1000; // 4 hours later

    const actual = isStartTimestampLessThanThreeHours(
      startTimestamp,
      endTimestamp,
    );

    expect(actual).toBe(false);
  });
});
