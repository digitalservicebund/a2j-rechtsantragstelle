import { z } from "zod";
import { StrapiInputSchema } from "./StrapiInput";
import { StrapiSelectSchema } from "./StrapiSelect";

export const StrapiFormComponentSchema = z.discriminatedUnion("__component", [
  StrapiInputSchema.required({ __component: true }),
  StrapiSelectSchema.required({ __component: true }),
]);

export type StrapiFormComponent = z.infer<typeof StrapiFormComponentSchema>;
