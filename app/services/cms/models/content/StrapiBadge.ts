import { z } from "zod";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { omitNull } from "~/util/omitNull";

export const StrapiBadgeSchema = z.object({
  content: z.string(),
  variant: z
    .enum(["info", "success", "warning", "danger"])
    .nullable()
    .transform(omitNull)
    .optional(),
  __component: z.literal("page.badge"),
  ...HasStrapiIdSchema.shape,
});
