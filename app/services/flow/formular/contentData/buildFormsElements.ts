import { isStrapiSelectComponent } from "~/services/cms/models/isStrapiSelectComponent";
import { type CMSContent } from "../buildFormularServerTranslations";

export const buildFormsElements = (cmsContent: CMSContent) => {
  return cmsContent.formContent.map((strapiFormElement) => {
    if (
      isStrapiSelectComponent(strapiFormElement) &&
      strapiFormElement.label === null &&
      cmsContent.heading !== undefined
    )
      strapiFormElement.altLabel = cmsContent.heading;
    return strapiFormElement;
  });
};
