import { z } from "zod";
import { HeadingSchema } from "./Heading";
import { ParagraphSchema } from "./Paragraph";

export const FormContentCmsSchema = z.union([HeadingSchema, ParagraphSchema]);

export type FormContentCms = z.infer<typeof FormContentCmsSchema>;
