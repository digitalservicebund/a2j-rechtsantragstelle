import type { Config } from "~/services/flow/server/types";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const stepIds = xStateTargetsFromPagesConfig(
  nachlassErbausschlagungAnfragePages,
);

export const kinderXStateConfig = {
  id: "kinder",
  initial: stepIds.kinderHasKid.relative,
  states: {
    [stepIds.kinderHasKid.relative]: {
      on: {
        BACK: stepIds.ausschlagendePersonRelationToErblasser.absolute,
      },
    },
  },
} satisfies Config<NachlassErbausschlagungAnfrageUserData>;
