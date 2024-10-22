import { headers } from "~/root";

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

describe("Headers", () => {
  const mockheaders = {
    parentHeaders: mockHeaders({}),
    actionHeaders: mockHeaders({}),
    errorHeaders: mockHeaders({}),
  };

  it("should set default security headers", () => {
    const loaderHeaders = mockHeaders({});
    expect(headers({ ...mockheaders, loaderHeaders })).toEqual(defaultHeaders);
  });

  it("should not set Cache-Control header when shouldCache returns false", () => {
    const loaderHeaders = mockHeaders({ shouldCache: "false" });
    expect(headers({ ...mockheaders, loaderHeaders })).toEqual(defaultHeaders);
  });

  it("should set Cache-Control header when shouldCache returns true", () => {
    const loaderHeaders = mockHeaders({ shouldCache: "true" });
    expect(headers({ ...mockheaders, loaderHeaders })).toEqual({
      ...defaultHeaders,
      "Cache-Control": "no-store",
    });
  });
});
