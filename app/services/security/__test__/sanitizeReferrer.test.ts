import { sanitizeReferrer } from "../sanitizeReferrer";

describe("sanitizeReferrer", () => {
  it("should return root path when referrer is missing", () => {
    const result = sanitizeReferrer("", "https://www.test.com");
    expect(result).toStrictEqual("/");
  });
  it("should return the referrer when it matches the origin", () => {
    const result = sanitizeReferrer(
      "https://www.test.com/foo/bar",
      "https://www.test.com",
    );
    expect(result).toStrictEqual("https://www.test.com/foo/bar");
  });
  it("should return root path when it does not match the origin", () => {
    const result = sanitizeReferrer(
      "https://www.test.com/foo/bar",
      "https://www.whatever.com",
    );
    expect(result).toStrictEqual("/");
  });
  it("should return root path when the referrer contains origin as substring", () => {
    const result = sanitizeReferrer(
      "https://www.whatever.com.test.com/foo/bar",
      "https://www.whatever.com",
    );
    expect(result).toStrictEqual("/");
  });
  it("should return root path when the referrer contains basic authentication", () => {
    const result = sanitizeReferrer(
      "https://username:password@whatever.com",
      "https://www.whatever.com",
    );
    expect(result).toStrictEqual("/");
  });
});
