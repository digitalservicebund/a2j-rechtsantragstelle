import { z } from "zod";
import { InputSchema } from "./Input";
import { SelectSchema } from "./Select";

export const FormComponentCmsSchema = z.discriminatedUnion("__component", [
  InputSchema.merge(
    z.object({
      __component: z.literal("form-elements.input"),
    })
  ),
  SelectSchema.merge(
    z.object({
      __component: z.literal("form-elements.select"),
    })
  ),
]);

export type FormComponentCms = z.infer<typeof FormComponentCmsSchema>;
