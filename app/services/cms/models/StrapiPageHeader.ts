import { z } from "zod";
import { PageHeaderProps } from "~/components/PageHeader";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";

export const StrapiPageHeaderSchema = z
  .object({
    title: z.string(),
    linkLabel: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema);

export type StrapiPageHeader = z.infer<typeof StrapiPageHeaderSchema>;

export const getPageHeaderProps = (
  cmsData: StrapiPageHeader,
): Partial<PageHeaderProps> => {
  return {
    title: cmsData.title,
    linkLabel: cmsData.linkLabel,
  };
};
