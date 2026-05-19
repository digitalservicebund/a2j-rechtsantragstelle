import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "./userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { verstorbeneXStateConfig } from "./verstorbene/xStateConfig";
import { ausschlagendePersonXStateConfig } from "./ausschlagendePerson/xStateConfig";

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
            SUBMIT: {
              guard: ({ context }) =>
                context.datenverarbeitungZustimmung === "on",
              target: "#verstorbene",
            },
          },
        },
      },
    },
    verstorbene: verstorbeneXStateConfig,
    "ausschlagende-person": ausschlagendePersonXStateConfig,
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
