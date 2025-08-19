import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";

export const StrapiVideoSchema = z.object({
  title: z.string(),
  url: z.string(),
  __component: z.literal("page.video"),
  ...HasStrapiIdSchema.shape,
});
