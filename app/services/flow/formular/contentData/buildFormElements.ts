import type { UserDataWithPageData } from "../../pageData";
import { type CMSContent } from "../buildCmsContentAndTranslations";

export const buildFormElements = (
  { formContent, heading }: CMSContent,
  userDataWithPageData?: UserDataWithPageData,
) =>
  formContent.map((element) => {
    // The following is a hotfix for missing validation messages on strapi (errors are shown in the CMS but not sent)
    if (
      (element.__component === "form-elements.select" ||
        element.__component === "form-elements.dropdown" ||
        element.__component === "form-elements.tile-group") &&
      element.errorMessages?.length === 0
    )
      element.errorMessages = [
        { code: "required", text: "Bitte treffen Sie eine Auswahl." },
      ];

    if (
      (element.__component === "form-elements.input" ||
        element.__component === "form-elements.textarea" ||
        element.__component === "form-elements.auto-suggest-input" ||
        element.__component === "form-elements.date-input" ||
        element.__component === "form-elements.time-input") &&
      element.errorMessages?.length === 0
    )
      element.errorMessages = [
        { code: "required", text: "Dieses Feld muss ausgefüllt werden." },
      ];

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
