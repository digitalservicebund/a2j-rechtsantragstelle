import { z } from "zod";
import { HasIdSchema } from "./HasId";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const ContainerSchema = z
  .object({
    id: z.number(),
    __component: z.literal("meta.container").optional(),
  })
  .merge(StrapiWrapperSchema)
  .merge(HasIdSchema)
  .strict();

export type Container = z.infer<typeof ContainerSchema>;
