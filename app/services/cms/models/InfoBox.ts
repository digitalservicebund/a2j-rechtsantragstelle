import { z } from "zod";
import { BackgroundSchema } from "./Background";
import { ContainerSchema } from "./Container";
import { HeadingSchema } from "./Heading";
import { InfoBoxItemSchema } from "./InfoBoxItem";

export const InfoBoxSchema = z.object({
  id: z.number(),
  __component: z.literal("page.info-box").optional(),
  heading: HeadingSchema.nullable(),
  items: z.array(InfoBoxItemSchema),
  outerBackground: BackgroundSchema.nullable(),
  container: ContainerSchema,
});

export type InfoBox = z.infer<typeof InfoBoxSchema>;
