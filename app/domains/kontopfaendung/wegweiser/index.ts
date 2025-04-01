import type { Flow } from "~/domains/flows.server";
import { type KontopfaendungWegweiserContext } from "./context";
import { getWegweiserStrings } from "./stringReplacements";
import { kontopfaendungWegweiserXstateConfig } from "./xStateConfig";

export const kontopfaendungWegweiser = {
  flowType: "vorabCheck",
  config: kontopfaendungWegweiserXstateConfig,
  guards: {},

  stringReplacements: (userData: KontopfaendungWegweiserContext) => ({
    ...getWegweiserStrings(userData),
  }),
} satisfies Flow;
