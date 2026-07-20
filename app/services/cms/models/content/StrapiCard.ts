import z from "zod";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";

export const StrapiCardSchema = z.object({
  __component: z.literal("page.card"),
  heading: StrapiHeadingSchema,
  title: z.string(),
  description: z.string(),
  buttonLabel: z.string(),
  ...HasStrapiIdSchema.shape,
});
