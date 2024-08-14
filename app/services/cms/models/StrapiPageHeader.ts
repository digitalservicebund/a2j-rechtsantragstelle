import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiPageHeaderSchema = z
  .object({
    title: z.string(),
    linkLabel: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

type StrapiPageHeader = z.infer<typeof StrapiPageHeaderSchema>;

export const getPageHeaderProps = (cmsData: StrapiPageHeader) => {
  return {
    title: cmsData.title,
    linkLabel: cmsData.linkLabel,
  };
};
