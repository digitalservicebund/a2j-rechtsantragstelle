import { PostHog } from "posthog-node";
import { config } from "~/services/env/web";

export const throw404OnProduction = () => {
  if (config().ENVIRONMENT === "production")
    throw new Response(null, { status: 404 });
};

export const throw404IfFeatureFlagEnabled = async (request: Request) => {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();
  if (POSTHOG_API_KEY && config().ENVIRONMENT === "production") {
    const client = new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST });
    if (
      (request.url.includes("geld-einklagen") ||
        request.url.includes("fluggastrechte/formular")) &&
      [true, undefined].includes(
        await client.isFeatureEnabled("hideOVFlow", "backend"),
      ) // isFeatureEnabled() returns undefined if posthog is down, in which case we also want to throw
    ) {
      throw new Response(null, { status: 404 });
    }
  }
};
