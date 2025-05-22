import type { Flow } from "~/domains/flows.server";
import config from "./flow.json";
import { guards } from "./guards";
import type { GeldEinklagenVorabcheckUserData } from "./userData";
import { getGerichtskostenvorschuss } from "../shared/gerichtskosten";

export const geldEinklagenVorabcheck = {
  flowType: "vorabCheck",
  stringReplacements: (context: GeldEinklagenVorabcheckUserData) => ({
    gerichtskostenvorschuss: getGerichtskostenvorschuss(context).toString(),
  }),
  config,
  guards,
} satisfies Flow;
