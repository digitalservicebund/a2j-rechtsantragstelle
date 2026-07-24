import {
  grundbesitzArraySchema,
  unternehmenArraySchema,
} from "~/domains/nachlass/erbschein/anfrage/nachlass/pages";
import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const nachlassFlowConfig = {
  grundbesitz: [
    {
      guard: (data) => data.hasGrundbesitz === "yes",
      target: "grundBesitzOverview",
    },
    {
      target: "unternehmen",
    },
  ],
  grundBesitzOverview: [
    {
      type: "addArrayItem",
      target: "grundbesitzAdresse",
    },
    {
      guard: (data) =>
        !grundbesitzArraySchema.safeParse(data.grundbesitz).success,
      target: "grundbesitzWarnung",
    },
    {
      target: "unternehmen",
    },
  ],
  grundbesitzWarnung: "grundBesitzOverview",
  grundbesitzAdresse: "grundBesitzOverview",
  unternehmen: [
    {
      guard: (data) => data.hasUnternehmen === "yes",
      target: "unternehmenOverview",
    },
    {
      target: "vermoegen",
    },
  ],
  unternehmenOverview: [
    {
      type: "addArrayItem",
      target: "unternehmenName",
    },
    {
      guard: (data) =>
        !unternehmenArraySchema.safeParse(data.unternehmen).success,
      target: "unternehmenWarnung",
    },
    {
      target: "vermoegen",
    },
  ],
  unternehmenWarnung: "unternehmenOverview",
  unternehmenName: "unternehmenOverview",
  vermoegen: [
    {
      guard: (data) => data.hasVermoegen !== undefined,
      target: "abgabe",
    },
  ],
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
