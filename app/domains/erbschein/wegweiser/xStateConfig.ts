import type { Config } from "~/services/flow/server/types";
import { erbscheinWegweiserPages } from "~/domains/erbschein/wegweiser/pages";
import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const stepIds = xStateTargetsFromPagesConfig(erbscheinWegweiserPages);

export const erbscheinWegweiserXstateConfig = {
  id: "/erbschein/wegweiser",
  initial: stepIds.start.relative,
  states: {
    [stepIds.start.relative]: {
      id: stepIds.start.relative,
      on: { SUBMIT: "grundvoraussetzungen" },
    },
    grundvoraussetzungen: {
      initial: stepIds.lebensmittelpunkt.relative,
      states: {
        [stepIds.lebensmittelpunkt.relative]: {
          on: {
            BACK: stepIds.start.absolute,
          },
        },
      },
    },
  },
} satisfies Config<ErbscheinWegweiserUserData>;
