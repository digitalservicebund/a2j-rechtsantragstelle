import type { Flow } from "~/domains/flows.server";
import { getAmtsgerichtStrings, getPlzStrings } from "./stringReplacements";
import { type ErbscheinNachlassGerichtUserData } from "~/domains/nachlass/erbschein/nachlassgericht/userData";
import { erbscheinNachlassgerichtFlowConfig } from "./flowConfig";

export const nachlassErbscheinNachlassgericht = {
  flowType: "vorabCheck",
  config: { states: {} },
  stringReplacements: (context: ErbscheinNachlassGerichtUserData) => ({
    ...getAmtsgerichtStrings(context),
    ...getPlzStrings(context),
  }),
  newEngineConfig: erbscheinNachlassgerichtFlowConfig,
} satisfies Flow<typeof erbscheinNachlassgerichtFlowConfig.pages>;
