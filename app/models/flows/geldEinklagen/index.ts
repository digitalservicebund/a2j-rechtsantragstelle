import config from "./config.json";
import { guards } from "./guards";
import { type AllContexts } from "../common";
import { getGerichtskostenvorschuss } from "../gerichtskosten";

export const geldEinklagenVorabcheck = {
  cmsSlug: "vorab-check-pages",
  stringReplacements: (context: AllContexts) => ({
    gerichtskostenvorschuss: getGerichtskostenvorschuss(context).toString(),
  }),
  config,
  guards,
} as const;
