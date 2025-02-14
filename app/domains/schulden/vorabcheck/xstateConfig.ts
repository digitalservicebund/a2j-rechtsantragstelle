import type { Config } from "~/services/flow/server/buildFlowController";
import { schuldenZwangsvollstreckungContext } from "./context";

export const zwangsVollStreckungVorabcheckXstateConfig = {
  id: "/schulden",
  initial: "zwangsvollstreckung",
  states: {
    zwangsvollstreckung: {},
  },
} satisfies Config<schuldenZwangsvollstreckungContext>;
