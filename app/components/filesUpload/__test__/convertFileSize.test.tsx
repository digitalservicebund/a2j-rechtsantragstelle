import { convertFileSize } from "../convertFileSize";

describe("convertFileSize", () => {
  it("should convert bytes to megabytes correctly", () => {
    const fileSize = 8388608;
    expect(convertFileSize(fileSize)).toBe("8 MB");
  });

  it("should convert small file sizes correctly", () => {
    const fileSize = 524288;
    expect(convertFileSize(fileSize)).toBe("0,5 MB");
  });

  it("should convert large file sizes correctly", () => {
    const fileSize = 1073741824;
    expect(convertFileSize(fileSize)).toBe("1.024 MB");
  });
  it("should convert zero bytes correctly", () => {
    const fileSize = 0;
    expect(convertFileSize(fileSize)).toBe("0 MB");
  });
  it("should convert null correctly", () => {
    const fileSize = null as unknown as number;
    expect(convertFileSize(fileSize)).toBe("0 MB");
  });
  it("should convert undefined correctly", () => {
    const fileSize = undefined as unknown as number;
    expect(convertFileSize(fileSize)).toBe("0 MB");
  });
});
