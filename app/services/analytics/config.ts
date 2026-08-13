import { config } from "~/services/env/public";

const { ENVIRONMENT } = config();

export const POSTHOG_API_HOST =
  ENVIRONMENT === "production"
    ? "https://ph-proxy.prod.tech.digitalservice.dev"
    : "https://ph-proxy.dev.tech.digitalservice.dev";
