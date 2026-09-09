import type { Flow } from "~/domains/flows.server";
import {
  getAmtsgerichtStrings,
  plz,
  shouldUseApplicantsCourt,
} from "~/domains/nachlass/erbausschlagung/gericht-finden/stringReplacements";
import { type ErbausschlagungGerichtFindenUserData } from "~/domains/nachlass/erbausschlagung/gericht-finden/userData";
import { erbausschlagungGerichtFindenFlowConfig } from "./flowConfig";

export const nachlassErbausschlagungGerichtFinden = {
  flowType: "vorabCheck",
  config: { states: {} },
  stringReplacements: (context: ErbausschlagungGerichtFindenUserData) => ({
    ...shouldUseApplicantsCourt(context),
    ...plz(context),
    ...getAmtsgerichtStrings(context),
  }),
  newEngineConfig: erbausschlagungGerichtFindenFlowConfig,
} satisfies Flow<typeof erbausschlagungGerichtFindenFlowConfig.pages>;
