import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const StrapiContainerSchema = z
  .object({
    __component: z.literal("meta.container").optional(),
    textColor: z.enum(["default", "white", "black"]).nullable(),
  })
  .merge(StrapiWrapperSchema)
  .merge(HasOptionalStrapiIdSchema)
  .strict();

export type StrapiContainer = z.infer<typeof StrapiContainerSchema>;
