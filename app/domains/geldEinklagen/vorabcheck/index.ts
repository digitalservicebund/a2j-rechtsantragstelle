import type { Flow } from "~/domains/flows.server";
import type { GeldEinklagenVorabcheckContext } from "./context";
import config from "./flow.json";
import { guards } from "./guards";
import { getGerichtskostenvorschuss } from "../shared/gerichtskosten";

export const geldEinklagenVorabcheck = {
  flowType: "vorabCheck",
  stringReplacements: (context: GeldEinklagenVorabcheckContext) => ({
    gerichtskostenvorschuss: getGerichtskostenvorschuss(context).toString(),
  }),
  config,
  guards,
} satisfies Flow;
