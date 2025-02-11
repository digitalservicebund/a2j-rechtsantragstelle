import { convertFileSize } from "../convertFileSize";

describe("convertFileSize", () => {
  it("should return the total file size in MB", () => {
    const fileSizes = [8388608];
    expect(convertFileSize(fileSizes)).toBe("8 MB");
  });

  it("should return 0,5 MB", () => {
    const fileSizes = [524288];
    expect(convertFileSize(fileSizes)).toBe("0,5 MB");
  });

  it("should return 1.024 MB", () => {
    const fileSizes = [1073741824];
    expect(convertFileSize(fileSizes)).toBe("1.024 MB");
  });

  it("should return 0 MB", () => {
    const fileSizes = [0];
    expect(convertFileSize(fileSizes)).toBe("0 MB");
  });
});
