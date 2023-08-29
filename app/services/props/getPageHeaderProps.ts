import { omitNull } from "~/util/omitNull";
import { PageHeaderPropsSchema } from "~/components/PageHeader";
import type { StrapiPageHeader } from "~/services/cms/models/StrapiPageHeader";

export const getPageHeaderProps = (cmsData: StrapiPageHeader) => {
  return PageHeaderPropsSchema.parse(omitNull(cmsData));
};
