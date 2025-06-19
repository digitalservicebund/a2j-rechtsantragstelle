// Note: To make this work on the client, window.ENV is set in root.tsx
const envFromBrowser = () =>
  typeof window === "object" && "ENV" in window
    ? (window?.ENV as Record<string, string | undefined>)
    : undefined;

const envFromNode = () =>
  typeof process === "object" && "env" in process ? process?.env : undefined;

// TODO: remove env variables not prefixed with PUBLIC_ once infra is updated (they are left for backwards compatibility)
export function config() {
  const env = envFromBrowser() ?? envFromNode() ?? {};
  return {
    POSTHOG_API_KEY: (
      env.PUBLIC_POSTHOG_API_KEY ?? env.POSTHOG_API_KEY
    )?.trim(),
    SENTRY_DSN: (env.PUBLIC_SENTRY_DSN ?? env.SENTRY_DSN)?.trim(),
    ENVIRONMENT: env.PUBLIC_ENVIRONMENT ?? env.ENVIRONMENT ?? "development",
  };
}
