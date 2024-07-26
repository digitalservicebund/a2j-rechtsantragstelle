import { z } from "zod";
import { flowIds } from "~/flows/flowIds";

export const StrapiFlowIdSchema = z.object({
  flowId: z.enum(flowIds),
});
