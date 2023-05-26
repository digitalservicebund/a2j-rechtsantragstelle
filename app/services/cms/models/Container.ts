import { z } from "zod";
import { WrapperSchema } from "./Wrapper";

export const ContainerSchema = z
  .object({
    id: z.number(),
    __component: z.literal("meta.container").optional(),
  })
  .merge(WrapperSchema);

export type Container = z.infer<typeof ContainerSchema>;
