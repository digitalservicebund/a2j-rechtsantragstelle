import { z } from "zod";
import { HasStrapiLocaleSchema } from "~/services/cms/models/HasStrapiLocale";

export const StrapiPageHeaderSchema = z.object({
  title: z.string(),
  linkLabel: z.string(),
  ...HasStrapiLocaleSchema.shape,
});

export type StrapiPageHeader = z.infer<typeof StrapiPageHeaderSchema>;
