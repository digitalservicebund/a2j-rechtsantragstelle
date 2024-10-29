import { z } from "zod";
import { flowIds } from "~/domains/flowIds";

const extraFlowIds = ["/beratungshilfe/zustaendiges-gericht"] as const;

export const StrapiFlowIdSchema = z.object({
  flowId: z.enum([...extraFlowIds, ...flowIds]),
});
