import type { Config } from "~/services/flow/server/buildFlowController";
import { schuldenZwangsvollstreckungContext } from "./context";

export const zwangsVollStreckungVorabcheckXstateConfig = {
  id: "/schulden/kontopfaendung/wegweiser",
  initial: "start",
  states: {
    start: {},
  },
} satisfies Config<schuldenZwangsvollstreckungContext>;
