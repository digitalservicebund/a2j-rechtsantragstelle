import { PostHog } from "posthog-node";
import { POSTHOG_API_HOST } from "./config";
import { config } from "../env/public";

const { POSTHOG_API_KEY } = config();
const posthogNodeClient = POSTHOG_API_KEY?.startsWith("phc_")
  ? new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST })
  : undefined;

export const getPosthogNodeClient = () => posthogNodeClient;
