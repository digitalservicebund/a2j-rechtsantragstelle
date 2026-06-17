import type { Flow } from "~/domains/flows.server";
import {
  getAmtsgerichtStrings,
  getPlzStrings,
} from "~/domains/nachlass/erbausschlagung/gericht-finden/stringReplacements";
import { type NachlassErbausschlagungGerichtFindenUserData } from "~/domains/nachlass/erbausschlagung/gericht-finden/userData";
import { nachlassErbausschlagungGerichtFindenXstateConfig } from "~/domains/nachlass/erbausschlagung/gericht-finden/xStateConfig";

export const nachlassErbausschlagungGerichtFinden = {
  flowType: "vorabCheck",
  config: nachlassErbausschlagungGerichtFindenXstateConfig,
  stringReplacements: (
    context: NachlassErbausschlagungGerichtFindenUserData,
  ) => ({
    ...getPlzStrings(context),
    ...getAmtsgerichtStrings(context),
  }),
} satisfies Flow;
