// Note: this test is separate from getPosthogNodeClient.test because config() is called at import time ands needs to be mocked twice
import { config } from "~/services/env/public";
import { getPosthogNodeClient } from "../posthogClient.server";

vi.mock("~/services/env/public", () => ({
  config: vi.fn().mockReturnValue({
    POSTHOG_API_KEY: "",
    SENTRY_DSN: undefined,
    ENVIRONMENT: "test",
  }),
}));

describe("getPosthogNodeClient", () => {
  it("returns undefined without POSTHOG_API_KEY", () => {
    vi.mocked(config).mockReturnValue({
      POSTHOG_API_KEY: "",
      SENTRY_DSN: undefined,
      ENVIRONMENT: "test",
    });

    expect(getPosthogNodeClient()).toBeUndefined();
  });
});
