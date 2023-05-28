import { z } from "zod";
import { HasIdSchema } from "./HasId";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const StrapiContainerSchema = z
  .object({
    id: z.number(),
    __component: z.literal("meta.container").optional(),
  })
  .merge(StrapiWrapperSchema)
  .merge(HasIdSchema)
  .strict();

export type StrapiContainer = z.infer<typeof StrapiContainerSchema>;
