import type { Flow } from "~/domains/flows.server";
import { guards } from "./guards";
import type { GeldEinklagenVorabcheckUserData } from "./userData";
import { geldEinklagenVorabcheckXstateConfig } from "./xstateConfig";
import { getGerichtskostenvorschuss } from "../shared/gerichtskosten";

export const geldEinklagenVorabcheck = {
  flowType: "vorabCheck",
  stringReplacements: (context: GeldEinklagenVorabcheckUserData) => ({
    gerichtskostenvorschuss: getGerichtskostenvorschuss(context).toString(),
  }),
  config: geldEinklagenVorabcheckXstateConfig,
  guards,
} satisfies Flow;
