import z from "zod";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";

export const nachlassPages = {
  grundbesitz: {
    stepId: "/nachlass/grundbesitz-frage",
    pageSchema: {
      hasGrundbesitz: z.enum(["yes", "no", "unknown"]),
    },
  },
} as const satisfies PageConfigMap;
