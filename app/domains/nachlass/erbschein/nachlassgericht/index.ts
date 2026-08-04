import type { Flow } from "~/domains/flows.server";
import { nachlassErbscheinNachlassgerichtXstateConfig } from "./xStateConfig";
import { getAmtsgerichtStrings, getPlzStrings } from "./stringReplacements";
import { type NachlassErbscheinNachlassGerichtUserData } from "~/domains/nachlass/erbschein/nachlassgericht/userData";

export const nachlassErbscheinNachlassgericht = {
  flowType: "vorabCheck",
  config: nachlassErbscheinNachlassgerichtXstateConfig,
  guards: {},
  stringReplacements: (context: NachlassErbscheinNachlassGerichtUserData) => ({
    ...getAmtsgerichtStrings(context),
    ...getPlzStrings(context),
  }),
} satisfies Flow;
