import { convertFileSize } from "../convertFileSize";

describe("convertFileSize", () => {
  it("should return the total file size in MB", () => {
    const fileSizes = [8388608];
    expect(convertFileSize(fileSizes)).toBe("8 MB");
  });
});
