import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "./userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

export const nachlassErbausschlagungAnfrageXStateConfig = {
  id: "/nachlass/erbausschlagung/anfrage",
  initial: "start",
  states: {
    start: {
      id: "start",
      initial: "start",
      states: {
        [stepIds.start.relative]: {
          on: {
            SUBMIT: stepIds.datenverarbeitung.relative,
          },
        },
        [stepIds.datenverarbeitung.relative]: {
          on: {
            BACK: stepIds.start.relative,
            SUBMIT: "#verstorbene-person",
          },
        },
      },
    },
    ["verstorbene-person"]: {
      id: "verstorbene-person",
      states: {},
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
