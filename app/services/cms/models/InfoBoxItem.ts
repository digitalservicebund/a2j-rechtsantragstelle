import { z } from "zod";
import { ButtonSchema } from "./Button";
import { HeadingSchema } from "./Heading";
import { ImageSchema } from "./Image";

export const InfoBoxItemSchema = z.object({
  id: z.number(),
  __component: z.literal("page.info-box-item"),
  label: HeadingSchema.optional(),
  headline: HeadingSchema,
  image: ImageSchema.optional(),
  content: z.string(),
  button: ButtonSchema.optional(),
});

export type InfoBoxItem = z.infer<typeof InfoBoxItemSchema>;
