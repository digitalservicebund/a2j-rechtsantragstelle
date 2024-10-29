import type { Flow } from "~/domains/flows.server";
import config from "./flow.json";
import { guards } from "./guards";
import { type AllContexts } from "../../common";
import { getGerichtskostenvorschuss } from "../../shared/gerichtskosten";

export const geldEinklagenVorabcheck = {
  cmsSlug: "vorab-check-pages",
  stringReplacements: (context: AllContexts) => ({
    gerichtskostenvorschuss: getGerichtskostenvorschuss(context).toString(),
  }),
  config,
  guards,
} satisfies Flow;
