import type { Flow } from "~/domains/flows.server";
import { kontopfaendungWegweiserXstateConfig } from "./xStateConfig";

export const kontopfaendungWegweiser = {
  flowType: "vorabCheck",
  config: kontopfaendungWegweiserXstateConfig,
  guards: {},
} satisfies Flow;
