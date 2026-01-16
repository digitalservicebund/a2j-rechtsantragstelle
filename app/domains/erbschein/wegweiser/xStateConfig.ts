import mapValues from "lodash/mapValues";
import type { Config } from "~/services/flow/server/types";
import { erbscheinWegweiserPages } from "~/domains/erbschein/wegweiser/pages";
import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";

const stepIds = mapValues(erbscheinWegweiserPages, (v) => v.stepId);

export const erbscheinWegweiserXstateConfig = {
  id: "/erbschein/wegweiser",
  initial: stepIds.start,
  states: {
    [stepIds.start]: {},
  },
} satisfies Config<ErbscheinWegweiserUserData>;
