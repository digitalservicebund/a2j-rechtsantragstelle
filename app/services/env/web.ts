const getNodeOrWebEnv = (): Record<string, string> =>
  typeof window === "object" && "ENV" in window
    ? (window as any)?.ENV
    : process.env;

export function config() {
  const env = getNodeOrWebEnv();

  return {
    POSTHOG_API_HOST: env.POSTHOG_API_HOST?.trim() ?? "https://eu.posthog.com",
    POSTHOG_API_KEY: env.POSTHOG_API_KEY?.trim() ?? "",
    SENTRY_DSN: env.SENTRY_DSN?.trim() ?? "",
    ENVIRONMENT: env.ENVIRONMENT ?? "local",
  };
}
