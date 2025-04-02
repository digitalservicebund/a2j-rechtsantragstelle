import type { Flow } from "~/domains/flows.server";
import { KontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";
import { kontopfaendungWegweiserXstateConfig } from "./xStateConfig";

export const kontopfaendungWegweiser = {
  flowType: "vorabCheck",
  config: kontopfaendungWegweiserXstateConfig,
  guards: {},
  stringReplacements: (context: KontopfaendungWegweiserContext) => ({
    hasArbeit: context.hasArbeit === "yes",
  }),
} satisfies Flow;
