import { z } from "zod";
import { PageHeaderPropsSchema } from "~/components/PageHeader";
import { omitNull } from "~/util/omitNull";
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
  return PageHeaderPropsSchema.parse(omitNull(cmsData));
};
