import { z } from "zod";
import { StrapiInputSchema } from "./StrapiInput";
import { StrapiSelectSchema } from "./StrapiSelect";

export const StrapiFormComponentSchema = z.discriminatedUnion("__component", [
  StrapiInputSchema.merge(
    z.object({
      __component: z.literal("form-elements.input"),
    })
  ),
  StrapiSelectSchema.merge(
    z.object({
      __component: z.literal("form-elements.select"),
    })
  ),
]);

export type StrapiFormComponent = z.infer<typeof StrapiFormComponentSchema>;
