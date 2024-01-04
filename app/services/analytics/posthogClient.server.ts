import { PostHog } from "posthog-node";
import { config } from "../env/web";

const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();
const posthogClient = POSTHOG_API_KEY
  ? new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST })
  : undefined;

export const getPosthogClient = () => posthogClient;
