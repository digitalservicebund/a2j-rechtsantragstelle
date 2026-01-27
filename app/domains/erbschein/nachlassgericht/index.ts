import type { Flow } from "~/domains/flows.server";
import { erbscheinNachlassgerichtXstateConfig } from "./xStateConfig";

export const erbscheinNachlassgericht = {
  flowType: "vorabCheck",
  config: erbscheinNachlassgerichtXstateConfig,
  guards: {},
  stringReplacements: () => ({}),
} satisfies Flow;
