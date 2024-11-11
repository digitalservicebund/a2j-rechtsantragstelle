const envFromBrowser = () =>
  typeof window === "object" && "ENV" in window
    ? (window?.ENV as Record<string, string | undefined>)
    : undefined;

const envFromNode = () =>
  typeof process === "object" && "env" in process ? process?.env : undefined;

export function config() {
  const env = envFromBrowser() ?? envFromNode() ?? {};
  return {
    POSTHOG_API_HOST:
      env.POSTHOG_API_HOST?.trim() ?? "https://eu.i.posthog.com",
    POSTHOG_API_KEY: env.POSTHOG_API_KEY?.trim(),
    SENTRY_DSN: env.SENTRY_DSN?.trim(),
    ENVIRONMENT: env.ENVIRONMENT ?? "local",
  };
}
