import { formatFileSizeToString } from "../formatFileSizeToString";

describe("formatFileSizeToString", () => {
  it("should convert bytes for very small file (< 1KB) sizes correctly", () => {
    const bytesCount = 500;
    expect(formatFileSizeToString(bytesCount)).toBe("500 B");
  });

  it("should convert kilobytes for small file (1KB - 1MB) sizes correctly", () => {
    const bytesCount = 19718;
    expect(formatFileSizeToString(bytesCount)).toBe("19,3 KB");
  });

  it("should convert convert megabytes for large file (>= 1 MB) sizes correctly", () => {
    const bytesCount = 2500000;
    expect(formatFileSizeToString(bytesCount)).toBe("2,4 MB");
  });
  it("should convert zero bytes correctly", () => {
    const bytesCount = 0;
    expect(formatFileSizeToString(bytesCount)).toBe("0 B");
  });
});
