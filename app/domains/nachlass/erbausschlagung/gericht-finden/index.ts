import type { Flow } from "~/domains/flows.server";
import {
  getAmtsgerichtStrings,
  plz,
  shouldUseApplicantsCourt,
} from "~/domains/nachlass/erbausschlagung/gericht-finden/stringReplacements";
import { type NachlassErbausschlagungGerichtFindenUserData } from "~/domains/nachlass/erbausschlagung/gericht-finden/userData";
import { nachlassErbausschlagungGerichtFindenFlowConfig } from "./flowConfig";

export const nachlassErbausschlagungGerichtFinden = {
  flowType: "vorabCheck",
  config: { states: {} },
  stringReplacements: (
    context: NachlassErbausschlagungGerichtFindenUserData,
  ) => ({
    ...shouldUseApplicantsCourt(context),
    ...plz(context),
    ...getAmtsgerichtStrings(context),
  }),
  newEngineConfig: nachlassErbausschlagungGerichtFindenFlowConfig,
} satisfies Flow<typeof nachlassErbausschlagungGerichtFindenFlowConfig.pages>;
