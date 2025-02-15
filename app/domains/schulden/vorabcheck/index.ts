import type { Flow } from "~/domains/flows.server";
import { zwangsVollStreckungVorabcheckXstateConfig } from "./xstateConfig";

export const zwangsvollstreckungVorabcheck = {
  flowType: "vorabCheck",
  config: zwangsVollStreckungVorabcheckXstateConfig,
  guards: {},
} satisfies Flow;
