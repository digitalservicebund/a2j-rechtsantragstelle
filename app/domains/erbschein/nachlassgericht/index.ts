import type { Flow } from "~/domains/flows.server";
import { erbscheinNachlassgerichtXstateConfig } from "./xStateConfig";
import type { ErbscheinNachlassGerichtUserData } from "./userData";

export const erbscheinNachlassgericht = {
  flowType: "vorabCheck",
  config: erbscheinNachlassgerichtXstateConfig,
  guards: {},
  migration: {
    source: "/erbschein/wegweiser",
    sortedFields: ["verstorbeneName"],
  },
  stringReplacements: (userData: ErbscheinNachlassGerichtUserData) => ({
    verstorbeneName: userData.verstorbeneName || "die verstorbene Person",
  }),
} satisfies Flow;
