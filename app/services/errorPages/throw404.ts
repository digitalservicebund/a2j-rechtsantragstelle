import { PostHog } from "posthog-node";
import { config } from "~/services/env/web";

export const throw404OnProduction = () => {
  if (config().ENVIRONMENT === "production")
    throw new Response(null, { status: 404 });
};

export const throw404IfFeatureFlagEnabled = async (request: Request) => {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();
  const { url } = request;
  const phCallerId = "backend";
  if (POSTHOG_API_KEY && config().ENVIRONMENT === "production") {
    const client = new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST });
    if (
      url.includes("/fluggastrechte/formular") &&
      !(await client.isFeatureEnabled("showFluggastrechteFormular", phCallerId))
    ) {
      throw new Response(null, { status: 404 });
    }

    if (
      (url.includes("/geld-einklagen/vorabcheck") ||
        url.includes("/geld-einklagen/formular")) &&
      !(await client.isFeatureEnabled("showGeldEinklagenFlow", phCallerId))
    ) {
      throw new Response(null, { status: 404 });
    }

    if (
      url.includes("/prozesskostenhilfe/antrag") &&
      !(await client.isFeatureEnabled("showProzesskostenhilfeFlow", phCallerId))
    ) {
      throw new Response(null, { status: 404 });
    }
  }
};
