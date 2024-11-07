import { originFromUrlString } from "~/util/originFromUrlString";
import { config } from "../env/web";

export const TRUSTED_DOMAINS = [config().POSTHOG_API_HOST, config().SENTRY_DSN]
  .map(originFromUrlString)
  .filter((origin) => origin !== undefined);
