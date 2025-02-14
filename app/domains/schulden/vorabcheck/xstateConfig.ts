import type { Config } from "~/services/flow/server/buildFlowController";
import { schuldenZwangsvollstreckungContext } from "./context";

export const zwangsVollStreckungVorabcheckXstateConfig = {
  id: "/schulden/kontopfaendung/wegweiser",
  initial: "zwangsvollstreckung",
  states: {
    zwangsvollstreckung: {},
  },
} satisfies Config<schuldenZwangsvollstreckungContext>;
