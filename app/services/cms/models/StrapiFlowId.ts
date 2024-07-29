import { z } from "zod";
import { flowIds } from "~/flows/flowIds";

const extraFlowIds = ["/beratungshilfe/zustaendiges-gericht"] as const;

export const StrapiFlowIdSchema = z.object({
  flowId: z.enum([...extraFlowIds, ...flowIds]),
});
