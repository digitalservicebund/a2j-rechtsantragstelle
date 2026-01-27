import type { config } from "../public";

type PublicConfig = ReturnType<typeof config>;

const defaultPublicConfig: PublicConfig = {
  POSTHOG_API_KEY: undefined,
  SENTRY_DSN: undefined,
  ENVIRONMENT: "test",
  BUNDID_IDP_ENTRY_POINT: undefined,
};

export function mockPublicConfig(
  overrides: Partial<PublicConfig> = {},
): PublicConfig {
  return { ...defaultPublicConfig, ...overrides };
}
