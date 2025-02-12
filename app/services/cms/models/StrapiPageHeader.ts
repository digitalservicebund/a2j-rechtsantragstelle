import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";

export const StrapiPageHeaderSchema = z
  .object({
    title: z.string(),
    linkLabel: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .transform((cmsData) => ({
    title: cmsData.title,
    linkLabel: cmsData.linkLabel,
  }));
