import { headers } from "~/root";

const mockHeaders = (headers: Record<string, string>): Headers => {
  return new Headers(headers);
};

describe("Headers", () => {
  it("returns correct headers without Cache-Control when trackingConsentSet is false", () => {
    const loaderHeaders = mockHeaders({ trackingConsentSet: "false" });

    const result = headers({
      loaderHeaders,
      parentHeaders: mockHeaders({}),
      actionHeaders: mockHeaders({}),
      errorHeaders: mockHeaders({}),
    });

    expect(result).toEqual({
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),layout-animations=(self),legacy-image-formats=(self),magnetometer=(),microphone=(),midi=(),oversized-images=(self),payment=(),picture-in-picture=(),publickey-credentials-get=(),speaker-selection=(),sync-xhr=(self),unoptimized-images=(self),unsized-media=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()",
    });
  });

  it("returns correct headers with Cache-Control when trackingConsentSet is true", () => {
    const loaderHeaders = mockHeaders({ trackingConsentSet: "true" });

    const result = headers({
      loaderHeaders,
      parentHeaders: mockHeaders({}),
      actionHeaders: mockHeaders({}),
      errorHeaders: mockHeaders({}),
    });

    expect(result).toEqual({
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),layout-animations=(self),legacy-image-formats=(self),magnetometer=(),microphone=(),midi=(),oversized-images=(self),payment=(),picture-in-picture=(),publickey-credentials-get=(),speaker-selection=(),sync-xhr=(self),unoptimized-images=(self),unsized-media=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()",
      "Cache-Control": "no-store",
    });
  });

  it("handles missing trackingConsentSet header", () => {
    const loaderHeaders = mockHeaders({});

    const result = headers({
      loaderHeaders,
      parentHeaders: mockHeaders({}),
      actionHeaders: mockHeaders({}),
      errorHeaders: mockHeaders({}),
    });

    expect(result).toEqual({
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),layout-animations=(self),legacy-image-formats=(self),magnetometer=(),microphone=(),midi=(),oversized-images=(self),payment=(),picture-in-picture=(),publickey-credentials-get=(),speaker-selection=(),sync-xhr=(self),unoptimized-images=(self),unsized-media=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()",
    });
  });
});
