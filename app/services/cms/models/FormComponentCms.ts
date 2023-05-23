import { z } from "zod";
import { InputSchema } from "./Input";
import { SelectSchema } from "./Select";

export const FormComponentCmsSchema = z.union([InputSchema, SelectSchema]);

export type FormComponentCms = z.infer<typeof FormComponentCmsSchema>;
