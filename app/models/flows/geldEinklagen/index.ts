import flow from "./config.json";
import { context } from "./context";
import { guards } from "./guards";
import { type AllContexts } from "../common";
import { getGerichtskostenvorschuss } from "../gerichtskosten";

export const geldEinklagenVorabcheck = {
  cmsSlug: "vorab-check-pages",
  stringReplacements: (context: AllContexts) => ({
    gerichtskostenvorschuss: getGerichtskostenvorschuss(context).toString(),
  }),
  flow,
  guards,
  context,
} as const;
