import { z } from "zod";
import { WrapperSchema } from "./Wrapper";

export const ContainerSchema = WrapperSchema.merge(
  z.object({
    id: z.number(),
    __component: z.literal("meta.container"),
  })
);

export type Container = z.infer<typeof WrapperSchema>;
