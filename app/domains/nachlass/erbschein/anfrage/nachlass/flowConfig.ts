import {
  grundbesitzArraySchema,
  unternehmenArraySchema,
} from "~/domains/nachlass/erbschein/anfrage/nachlass/pages";
import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { z } from "zod";

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
      guard: (data) => !z.validate(grundbesitzArraySchema, data.grundbesitz),
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
      guard: (data) => !z.validate(unternehmenArraySchema, data.unternehmen),
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
      target: "weitereAngaben",
    },
  ],
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
