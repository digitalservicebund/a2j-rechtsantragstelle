import type { Config } from "~/services/flow/server/types";
import type { BeratungshilfeFormularUserData } from "./userData";

// This flow runs on the new flow engine (see flowConfig.ts). The XState config
// is kept only as a minimal stub: the `Flow` type still requires a `config`, and
// the flow test harness reads `config.id` as the flowId. The full XState state
// chart was removed during the new-engine migration.
export const beratungshilfeXstateConfig = {
  id: "/beratungshilfe/antrag",
  initial: "start",
  states: { start: {} },
} satisfies Config<BeratungshilfeFormularUserData>;
