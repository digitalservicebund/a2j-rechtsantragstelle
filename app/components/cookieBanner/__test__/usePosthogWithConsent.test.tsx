import { renderHook } from "@testing-library/react";
import { type PropsWithChildren } from "react";
import React from "react";
import { CookieConsentContext } from "../CookieConsentContext";
import { usePosthogWithConsent } from "../usePosthogWithConsent";

const opt_in_capturing = vi.fn();
const opt_out_capturing = vi.fn();
const mockPosthog = {
  opt_in_capturing,
  opt_out_capturing,
  capture: vi.fn(),
};
vi.mock("posthog-js/react", () => ({
  usePostHog: () => mockPosthog,
}));

function wrapperWithConsent(consent: boolean | null) {
  return function Wrapper(props: PropsWithChildren) {
    return React.createElement(
      CookieConsentContext.Provider,
      { value: consent ?? undefined },
      props.children,
    );
  };
}

describe("usePosthogWithConsent", () => {
  beforeEach(() => {
    opt_in_capturing.mockClear();
    opt_out_capturing.mockClear();
  });

  it("should return correctly whenposthog and hasTrackingConsent is true and call opt_in_capturing", () => {
    const { result } = renderHook(() => usePosthogWithConsent(), {
      wrapper: wrapperWithConsent(true),
    });
    expect(result.current.posthog).toBe(mockPosthog);
    expect(result.current.hasTrackingConsent).toBe(true);
    expect(opt_in_capturing).toHaveBeenCalledTimes(1);
    expect(opt_out_capturing).not.toHaveBeenCalled();
  });

  it("should return correctly when posthog and hasTrackingConsent is false and call opt_out_capturing", () => {
    const { result } = renderHook(() => usePosthogWithConsent(), {
      wrapper: wrapperWithConsent(false),
    });
    expect(result.current.posthog).toBe(mockPosthog);
    expect(result.current.hasTrackingConsent).toBe(false);
    expect(opt_out_capturing).toHaveBeenCalledTimes(1);
    expect(opt_in_capturing).not.toHaveBeenCalled();
  });

  it("should return correctly when posthog and hasTrackingConsent is undefined and not call opt_in or opt_out", () => {
    const { result } = renderHook(() => usePosthogWithConsent(), {
      wrapper: wrapperWithConsent(null),
    });
    expect(result.current.posthog).toBe(mockPosthog);
    expect(result.current.hasTrackingConsent).toBe(undefined);
    expect(opt_in_capturing).not.toHaveBeenCalled();
    expect(opt_out_capturing).not.toHaveBeenCalled();
  });
});
