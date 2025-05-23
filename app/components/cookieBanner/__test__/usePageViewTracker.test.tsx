import { renderHook } from "@testing-library/react";
import { useLocation } from "react-router";
import { vi, type Mock } from "vitest";
import { usePageViewTracker } from "../usePageViewTracker";
import * as usePosthogWithConsentModule from "../usePosthogWithConsent";

vi.mock("react-router", () => {
  return {
    useLocation: vi.fn(),
  };
});

vi.mock("../usePosthogWithConsent", () => {
  return {
    usePosthogWithConsent: vi.fn(() => ({
      posthog: {
        capture: vi.fn(),
      },
    })),
  };
});

describe("usePageViewTracker", () => {
  const mockCapture = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function setup({
    posthog = undefined,
    hasTrackingConsent = false,
    pathname = "/",
  }: {
    posthog?: { capture: (event: string) => void };
    hasTrackingConsent?: boolean;
    pathname?: string;
  }) {
    (usePosthogWithConsentModule.usePosthogWithConsent as Mock).mockReturnValue(
      {
        posthog,
        hasTrackingConsent,
      },
    );
    (useLocation as unknown as Mock).mockReturnValue({ pathname });
  }

  it("should not call capture if posthog is undefined", () => {
    setup({ posthog: undefined, hasTrackingConsent: true, pathname: "/test" });
    renderHook(() => usePageViewTracker());
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("should not call capture if hasTrackingConsent is false", () => {
    setup({
      posthog: { capture: mockCapture },
      hasTrackingConsent: false,
      pathname: "/test",
    });
    renderHook(() => usePageViewTracker());
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("should call capture('$pageview') if posthog is defined and hasTrackingConsent is true", () => {
    setup({
      posthog: { capture: mockCapture },
      hasTrackingConsent: true,
      pathname: "/test",
    });
    renderHook(() => usePageViewTracker());
    expect(mockCapture).toHaveBeenCalledWith("$pageview");
  });

  it("should call capture('$pageview') again when pathname changes", () => {
    setup({
      posthog: { capture: mockCapture },
      hasTrackingConsent: true,
      pathname: "/test",
    });
    const { rerender } = renderHook(() => usePageViewTracker());
    expect(mockCapture).toHaveBeenCalledTimes(1);

    setup({
      posthog: { capture: mockCapture },
      hasTrackingConsent: true,
      pathname: "/test/other-page",
    });
    rerender();
    expect(mockCapture).toHaveBeenCalledTimes(2);
  });
});
