import { z } from "zod";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const StrapiContainerSchema = z
  .object({
    __component: z.literal("meta.container").optional(),
  })
  .merge(StrapiWrapperSchema);

export type StrapiContainer = z.infer<typeof StrapiContainerSchema>;
