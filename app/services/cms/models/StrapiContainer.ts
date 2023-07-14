import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const StrapiContainerSchema = z
  .object({
    __component: z.literal("meta.container").optional(),
  })
  .merge(StrapiWrapperSchema)
  .merge(HasOptionalStrapiIdSchema);

export type StrapiContainer = z.infer<typeof StrapiContainerSchema>;
