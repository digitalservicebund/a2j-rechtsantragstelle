import type { Flow } from "~/domains/flows.server";
import { getAmtsgerichtStrings, getPlzStrings } from "./stringReplacements";
import { type NachlassErbscheinNachlassGerichtUserData } from "~/domains/nachlass/erbschein/nachlassgericht/userData";
import { nachlassErbscheinNachlassgerichtFlowConfig } from "./flowConfig";

export const nachlassErbscheinNachlassgericht = {
  flowType: "vorabCheck",
  config: { states: {} },
  stringReplacements: (context: NachlassErbscheinNachlassGerichtUserData) => ({
    ...getAmtsgerichtStrings(context),
    ...getPlzStrings(context),
  }),
  newEngineConfig: nachlassErbscheinNachlassgerichtFlowConfig,
} satisfies Flow<typeof nachlassErbscheinNachlassgerichtFlowConfig.pages>;
