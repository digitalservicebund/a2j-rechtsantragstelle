import { z } from "zod";
import { StrapiButtonSchema } from "./StrapiButton";
import { HasIdSchema } from "./HasId";
import { HeadingSchema } from "./Heading";
import { ImageSchema } from "./Image";

export const InfoBoxItemSchema = z
  .object({
    __component: z.literal("page.info-box-item").optional(),
    label: HeadingSchema.nullable(),
    headline: HeadingSchema.nullable(),
    image: ImageSchema.optional(),
    content: z.string(),
    button: StrapiButtonSchema.nullable(),
  })
  .merge(HasIdSchema)
  .strict();

export type InfoBoxItem = z.infer<typeof InfoBoxItemSchema>;
