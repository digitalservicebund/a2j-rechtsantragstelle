import { headers } from "~/root";
import { shouldSetCacheControlHeader } from "~/util/shouldSetCacheControlHeader";

const mockHeaders = (headers: Record<string, string>): Headers => {
  return new Headers(headers);
};

const defaultHeaders = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),layout-animations=(self),legacy-image-formats=(self),magnetometer=(),microphone=(),midi=(),oversized-images=(self),payment=(),picture-in-picture=(),publickey-credentials-get=(),speaker-selection=(),sync-xhr=(self),unoptimized-images=(self),unsized-media=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()",
};

vi.mock("~/util/shouldSetCacheControlHeader", () => ({
  shouldSetCacheControlHeader: vi.fn(),
}));

describe("Headers", () => {
  const mockheaders = {
    parentHeaders: mockHeaders({}),
    actionHeaders: mockHeaders({}),
    errorHeaders: mockHeaders({}),
    loaderHeaders: mockHeaders({}),
  };

  it("should set default security headers", () => {
    const result = headers({ ...mockheaders });
    expect(result).toEqual(defaultHeaders);
  });

  it("should not set Cache-Control header when shouldSetCacheControlHeader returns false", () => {
    vi.mocked(shouldSetCacheControlHeader).mockReturnValue(false);
    const result = headers({ ...mockheaders });
    expect(result).not.toHaveProperty("Cache-Control");
    expect(shouldSetCacheControlHeader).toHaveBeenCalled();
  });

  it("should set Cache-Control header when shouldSetCacheControlHeader returns true", () => {
    vi.mocked(shouldSetCacheControlHeader).mockReturnValue(true);
    const result = headers({ ...mockheaders });
    expect(result).toHaveProperty("Cache-Control", "no-store");
    expect(shouldSetCacheControlHeader).toHaveBeenCalled();
  });
});
