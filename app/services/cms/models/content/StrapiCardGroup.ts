import z from "zod";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiCardSchema } from "./StrapiCard";

export const StrapiCardGroupSchema = z.object({
  __component: z.literal("page.card-group"),
  cards: z.array(StrapiCardSchema).min(1).max(6),
  ...HasStrapiIdSchema.shape,
});
