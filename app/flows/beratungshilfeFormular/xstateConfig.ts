import type { Config } from "~/services/flow/server/buildFlowController";
import type { BeratungshilfeFormularContext } from ".";
import { finanzielleAngabenArrayConfig as beratungshilfeFormularFinanzielleAngabenArrayConfig } from "./finanzielleAngaben/arrayConfiguration";
import { finanzielleAngabenArrayConfig } from "../shared/finanzielleAngaben/arrayConfiguration";

export const beratungshilfeXstateConfig = {
  id: "/beratungshilfe/antrag",
  initial: "start",
  meta: {
    arrays: {
      ...finanzielleAngabenArrayConfig(
        "/beratungshilfe/antrag/finanzielle-angaben",
      ),
      ...beratungshilfeFormularFinanzielleAngabenArrayConfig(
        "/beratungshilfe/antrag/finanzielle-angaben",
      ),
    },
  },
  states: {
    start: {
      id: "antragStart",
      initial: "start",
      meta: { done: () => true },
      states: {
        start: { on: { SUBMIT: "#grundvoraussetzungen" } },
      },
    },
  },
} satisfies Config<BeratungshilfeFormularContext>;
