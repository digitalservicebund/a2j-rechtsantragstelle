import { type GeldEinklagenVorabcheckUserData } from "~/domains/geldEinklagen/vorabcheck/userData";
import { type Config } from "~/services/flow/server/buildFlowController";

export const geldEinklagenVorabcheckXstateConfig = {
  id: "/geld-einklagen/vorabcheck",
  initial: "start",
  states: { start: {} },
} satisfies Config<GeldEinklagenVorabcheckUserData>;
