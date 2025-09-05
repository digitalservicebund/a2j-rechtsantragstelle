import { z } from "zod";
import { flowIds } from "~/domains/flowIds";

export const StrapiFlowIdSchema = z.object({ flowId: z.enum(flowIds) });
