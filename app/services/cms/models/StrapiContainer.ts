import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const StrapiContainerSchema = z
  .object({
    id: z.number(),
    __component: z.literal("meta.container").optional(),
  })
  .merge(StrapiWrapperSchema)
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiContainer = z.infer<typeof StrapiContainerSchema>;
