import type { Flow } from "~/domains/flows.server";
import { schuldenKontopfaendungWegweiserVorabcheckXstateConfig } from "./xstateConfig";

export const schuldenKontopfaendungWegweiserVorabcheck = {
  flowType: "vorabCheck",
  config: schuldenKontopfaendungWegweiserVorabcheckXstateConfig,
  guards: {},
} satisfies Flow;
