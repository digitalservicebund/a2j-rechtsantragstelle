import { z } from "zod";
import { BackgroundSchema } from "./Background";
import { ContainerSchema } from "./Container";
import { HasIdSchema } from "./HasId";
import { HeadingSchema } from "./Heading";
import { InfoBoxItemSchema } from "./InfoBoxItem";

export const InfoBoxSchema = z
  .object({
    __component: z.literal("page.info-box").optional(),
    heading: HeadingSchema.nullable(),
    items: z.array(InfoBoxItemSchema),
    outerBackground: BackgroundSchema.nullable(),
    container: ContainerSchema,
  })
  .merge(HasIdSchema)
  .strict();

export type InfoBox = z.infer<typeof InfoBoxSchema>;
