import type { Flow } from "~/domains/flows.server";
import { erbscheinNachlassgerichtXstateConfig } from "./xStateConfig";
import { getAmtsgerichtStrings } from "./stringReplacements";

export const erbscheinNachlassgericht = {
  flowType: "vorabCheck",
  config: erbscheinNachlassgerichtXstateConfig,
  guards: {},
  stringReplacements: () => ({ ...getAmtsgerichtStrings() }),
} satisfies Flow;
