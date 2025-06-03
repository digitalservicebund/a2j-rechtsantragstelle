// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { PostHog } from "posthog-js";
import { config } from "~/services/env/web";
import { useInitPosthog } from "../useInitPosthog";

vi.mock("~/services/env/web");

describe("useInitPosthog", () => {
  vi.mocked(config).mockReturnValue({
    POSTHOG_API_KEY: "test-api-key",
    POSTHOG_API_HOST: "posthog-host",
    SENTRY_DSN: undefined,
    ENVIRONMENT: "test",
  });

  test("returns loaded posthog instance", () => {
    const { result } = renderHook(() => useInitPosthog(true));
    expect(result.current).toBeInstanceOf(PostHog);
    expect(result.current?.__loaded).toBe(true);
  });

  test("returns undefined without tracking consent", () => {
    const { result } = renderHook(() => useInitPosthog());
    expect(result.current).toBeUndefined();
  });

  test("returns undefined with negative tracking consent", () => {
    const { result } = renderHook(() => useInitPosthog(false));
    expect(result.current).toBeUndefined();
  });

  test("returns undefined without POSTHOG_API_KEY", () => {
    vi.mocked(config).mockReturnValueOnce({
      POSTHOG_API_KEY: undefined,
      POSTHOG_API_HOST: "posthog-host",
      SENTRY_DSN: undefined,
      ENVIRONMENT: "test",
    });

    const { result } = renderHook(() => useInitPosthog(true));
    expect(result.current).toBeUndefined();
  });
});
