import { random } from "lodash";
import { flowIds } from "~/flows/flowIds";
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

  const flowId = flowIds[random(flowIds.length - 1)];

  it("returns correct headers without Cache-Control when trackingConsentSet is false and a flowId isn't part of pathname", () => {
    const loaderHeaders = mockHeaders({
      trackingConsentSet: "false",
      pathname: "/",
    });
    expect(headers({ ...mockheaders, loaderHeaders })).toEqual(defaultHeaders);
  });

  it("returns correct headers with Cache-Control when trackingConsentSet is true and a flowId isn't part of pathname", () => {
    const loaderHeaders = mockHeaders({
      trackingConsentSet: "true",
      pathname: "/",
    });
    expect(headers({ ...mockheaders, loaderHeaders })).toEqual({
      ...defaultHeaders,
      "Cache-Control": "no-store",
    });
  });

  it("returns correct headers with Cache-Control when trackingConsentSet is false and a flowId is part of pathname", () => {
    const loaderHeaders = mockHeaders({
      trackingConsentSet: "false",
      pathname: flowId,
    });
    expect(headers({ ...mockheaders, loaderHeaders })).toEqual({
      ...defaultHeaders,
      "Cache-Control": "no-store",
    });
  });

  it("returns correct headers with Cache-Control when trackingConsentSet is true and a flowId is part of pathname", () => {
    const loaderHeaders = mockHeaders({
      trackingConsentSet: "true",
      pathname: flowId,
    });
    expect(headers({ ...mockheaders, loaderHeaders })).toEqual({
      ...defaultHeaders,
      "Cache-Control": "no-store",
    });
  });

  it("handles missing trackingConsentSet header", () => {
    const loaderHeaders = mockHeaders({});
    expect(headers({ ...mockheaders, loaderHeaders })).toEqual(defaultHeaders);
  });
});
