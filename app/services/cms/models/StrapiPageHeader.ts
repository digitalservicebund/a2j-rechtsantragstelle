import { z } from "zod";

export const StrapiPageHeaderSchema = z.object({
  title: z.string(),
  linkLabel: z.string(),
});
