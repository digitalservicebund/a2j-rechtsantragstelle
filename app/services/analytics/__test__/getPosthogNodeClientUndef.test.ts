// Note: this test is separate from getPosthogNodeClient.test because config() is called at import time and needs to be mocked before import
import { mockPublicConfig } from "~/services/env/__test__/publicConfigMock";
import { getPosthogNodeClient } from "../posthogClient.server";

vi.mock("~/services/env/public", () => ({
  config: () => mockPublicConfig({ POSTHOG_API_KEY: "" }),
}));

describe("getPosthogNodeClient", () => {
  it("returns undefined without POSTHOG_API_KEY", () => {
    expect(getPosthogNodeClient()).toBeUndefined();
  });
});
