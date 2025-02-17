import type { Flow } from "~/domains/flows.server";
import { schuldenVorabcheckXstateConfig } from "./xstateConfig";

export const schuldenVorabcheck = {
  flowType: "vorabCheck",
  config: schuldenVorabcheckXstateConfig,
  guards: {},
} satisfies Flow;
