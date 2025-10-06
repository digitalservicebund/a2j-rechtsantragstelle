import type { UserDataWithPageData } from "../../pageData";
import { type CMSContent } from "../buildCmsContentAndTranslations";

export const buildFormElements = (
  { formContent, heading }: CMSContent,
  userDataWithPageData?: UserDataWithPageData,
) =>
  formContent.map((element) => {
    if (element.__component === "form-elements.select" && heading)
      element.altLabel = heading;

    if (
      element.__component === "form-elements.auto-suggest-input" &&
      element.dataList === "streetNames" &&
      typeof userDataWithPageData?.plz === "string"
    )
      element.dataListArgument = userDataWithPageData.plz;
    return element;
  });
