import { type CMSContent } from "./buildCmsContentAndTranslations";
import { isStrapiHeadingComponent } from "~/services/cms/models/isStrapiHeadingComponent";

export const buildFormElements = ({
  formContent,
  heading,
  content,
}: CMSContent) => {
  const contentHeading = content.find(isStrapiHeadingComponent);
  const replaceAltLabel = heading ?? contentHeading?.text;

  if (!replaceAltLabel) {
    return formContent;
  }

  return formContent.map((element) => {
    if (
      element.__component === "form-elements.select" ||
      element.__component === "form-elements.tile-group"
    )
      element.altLabel = replaceAltLabel;

    return element;
  });
};
