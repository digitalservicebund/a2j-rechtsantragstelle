import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiInfoBoxItemSchema } from "./StrapiInfoBoxItem";

export const StrapiInfoBoxSchema = z
  .object({
    __component: z.literal("page.info-box").optional(),
    heading: StrapiHeadingSchema.nullable(),
    items: z.array(StrapiInfoBoxItemSchema),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiInfoBox = z.infer<typeof StrapiInfoBoxSchema>;
