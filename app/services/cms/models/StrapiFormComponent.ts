import { z } from "zod";
import { StrapiInputSchema } from "./StrapiInput";
import { StrapiSelectSchema } from "./StrapiSelect";
import { StrapiDropdownSchema } from "./StrapiDropdown";

export const StrapiFormComponentSchema = z.discriminatedUnion("__component", [
  StrapiInputSchema.required({ __component: true }),
  StrapiSelectSchema.required({ __component: true }),
  StrapiDropdownSchema.required({ __component: true }),
]);
