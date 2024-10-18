import { shouldSetCacheControlHeader } from "../shouldSetCacheControlHeader";

const mockHeaders = (headers: Record<string, string>): Headers => {
  return new Headers(headers);
};

describe("shouldSetCacheControlHeader", () => {
  it("should return false when tracking consent is not set and no flowId in pathname", () => {
    const loaderHeaders = mockHeaders({
      trackingConsentSet: "false",
      pathname: "/",
    });
    expect(shouldSetCacheControlHeader(loaderHeaders)).toBe(false);
  });

  it("should return true when tracking consent is set and no flowId in pathname", () => {
    const loaderHeaders = mockHeaders({
      trackingConsentSet: "true",
      pathname: "/",
    });
    expect(shouldSetCacheControlHeader(loaderHeaders)).toBe(true);
  });

  it("should return true when tracking consent is no set and flowId is in pathname", () => {
    const loaderHeaders = mockHeaders({
      trackingConsentSet: "false",
      pathname: "/fluggastrechte/vorabcheck/bereich",
    });
    expect(shouldSetCacheControlHeader(loaderHeaders)).toBe(true);
  });

  it("should return true when tracking consent is set and flowId is in pathname", () => {
    const loaderHeaders = mockHeaders({
      trackingConsentSet: "true",
      pathname:
        "/fluggastrechte/formular/grundvoraussetzungen/daten-uebernahme",
    });
    expect(shouldSetCacheControlHeader(loaderHeaders)).toBe(true);
  });
});
