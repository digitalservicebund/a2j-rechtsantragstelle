import type { Flow } from "~/domains/flows.server";
import { erbscheinNachlassgerichtXstateConfig } from "./xStateConfig";
import { getAmtsgerichtStrings, getPlzStrings } from "./stringReplacements";
import { type ErbscheinNachlassGerichtUserData } from "~/domains/erbschein/nachlassgericht/userData";

export const erbscheinNachlassgericht = {
  flowType: "vorabCheck",
  config: erbscheinNachlassgerichtXstateConfig,
  guards: {},
  stringReplacements: (context: ErbscheinNachlassGerichtUserData) => ({
    ...getAmtsgerichtStrings(context),
    ...getPlzStrings(context),
  }),
} satisfies Flow;
