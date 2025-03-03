import { bytesToMegabytesString } from "../bytesToMegabytesString";

describe("bytesToMegabytesString", () => {
  it("should convert bytes to megabytes correctly", () => {
    const bytesCount = 8388608;
    expect(bytesToMegabytesString(bytesCount)).toBe("8 MB");
  });

  it("should convert small file sizes correctly", () => {
    const bytesCount = 524288;
    expect(bytesToMegabytesString(bytesCount)).toBe("0,5 MB");
  });

  it("should convert large file sizes correctly", () => {
    const bytesCount = 1073741824;
    expect(bytesToMegabytesString(bytesCount)).toBe("1.024 MB");
  });
  it("should convert zero bytes correctly", () => {
    const bytesCount = 0;
    expect(bytesToMegabytesString(bytesCount)).toBe("0 MB");
  });
});
