import { type CMSContent } from "../buildCmsContentAndTranslations";

export const buildFormElements = (cmsContent: CMSContent) => {
  return cmsContent.formContent.map((strapiFormElement) => {
    if (strapiFormElement.__component !== "form-elements.select") {
      return strapiFormElement;
    }

    if (cmsContent.heading !== undefined) {
      strapiFormElement.altLabel = cmsContent.heading;
    }

    return strapiFormElement;
  });
};
