import { shouldSetCacheControlHeader } from "../shouldSetCacheControlHeader";

describe("shouldSetCacheControlHeader", () => {
  it("should return false when tracking consent is set to false and no flowId in pathname", () => {
    const trackingConsent = "false";
    const pathname = "/";
    expect(shouldSetCacheControlHeader(pathname, trackingConsent)).toBe(false);
  });

  it("should return false when tracking consent is set to true and no flowId in pathname", () => {
    const trackingConsent = "true";
    const pathname = "/";
    expect(shouldSetCacheControlHeader(pathname, trackingConsent)).toBe(false);
  });

  it("should return true when tracking consent is not set and no flowId in pathname", () => {
    const trackingConsent = undefined;
    const pathname = "/";
    expect(shouldSetCacheControlHeader(pathname, trackingConsent)).toBe(true);
  });

  it("should return true when tracking consent is not set and flowId is in pathname", () => {
    const trackingConsent = undefined;
    const pathname = "/fluggastrechte/vorabcheck/bereich";
    expect(shouldSetCacheControlHeader(pathname, trackingConsent)).toBe(true);
  });

  it("should return true when tracking consent is set and flowId is in pathname", () => {
    const trackingConsent = "true";
    const pathname =
      "/fluggastrechte/formular/grundvoraussetzungen/daten-uebernahme";
    expect(shouldSetCacheControlHeader(pathname, trackingConsent)).toBe(true);
  });
});
