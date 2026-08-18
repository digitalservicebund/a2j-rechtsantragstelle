import { type CMSContent } from "./buildCmsContentAndTranslations";
import { isStrapiHeadingComponent } from "~/services/cms/models/isStrapiHeadingComponent";

export const buildFormElements = ({
  formContent,
  heading,
  content,
}: CMSContent) => {
  const contentHeading = content.find(isStrapiHeadingComponent);
  const replaceAltLabel = heading ?? contentHeading?.text;

  return formContent.map((element) => {
    if (element.__component === "form-elements.select" && replaceAltLabel)
      element.altLabel = replaceAltLabel;

    return element;
  });
};
