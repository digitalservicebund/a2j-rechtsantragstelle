import { z } from "zod";
import { HasIdSchema } from "./HasId";
import { WrapperSchema } from "./Wrapper";

export const ContainerSchema = z
  .object({
    id: z.number(),
    __component: z.literal("meta.container").optional(),
  })
  .merge(WrapperSchema)
  .merge(HasIdSchema)
  .strict();

export type Container = z.infer<typeof ContainerSchema>;
