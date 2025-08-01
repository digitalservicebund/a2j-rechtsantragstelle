// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { PostHog } from "posthog-js";
import { config } from "~/services/env/public";
import { useInitPosthog } from "../useInitPosthog";

vi.mock("~/services/env/public");

describe("useInitPosthog", () => {
  vi.mocked(config).mockReturnValue({
    POSTHOG_API_KEY: "test-api-key",
    SENTRY_DSN: undefined,
    ENVIRONMENT: "test",
  });

  test("returns loaded posthog instance", async () => {
    const { result } = renderHook(() => useInitPosthog(true));
    await waitFor(() => expect(result.current).toBeInstanceOf(PostHog));
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
      SENTRY_DSN: undefined,
      ENVIRONMENT: "test",
    });

    const { result } = renderHook(() => useInitPosthog(true));
    expect(result.current).toBeUndefined();
  });
});
