import type { Config } from "~/services/flow/server/types";
import mapValues from "lodash/mapValues";
import { type NachlassErbausschlagungGerichtFindenUserData } from "~/domains/nachlass/erbausschlagung/gericht-finden/userData";
import { nachlassErbausschlagungGerichtFindenPages } from "~/domains/nachlass/erbausschlagung/gericht-finden/pages";

const stepIds = mapValues(
  nachlassErbausschlagungGerichtFindenPages,
  (v) => v.stepId,
);

export const nachlassErbausschlagungGerichtFindenXstateConfig = {
  id: "/nachlass/erbausschlagung/gericht-finden",
  initial: stepIds.start,
  states: {
    [stepIds.start]: {
      on: { SUBMIT: "" },
    },
  },
} satisfies Config<NachlassErbausschlagungGerichtFindenUserData>;
