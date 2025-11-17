import type { UserDataWithPageData } from "../../pageData";
import { type CMSContent } from "../buildCmsContentAndTranslations";

type FormElement = CMSContent["formContent"][number];

const addDataListArgumentToAutoSuggestionInput = (
  element: FormElement,
  userDataWithPageData: UserDataWithPageData,
) => {
  if (
    element.__component === "form-elements.auto-suggest-input" &&
    element.dataList === "streetNames"
  ) {
    let dataListArgument = undefined;

    if (typeof userDataWithPageData?.plz === "string") {
      dataListArgument = userDataWithPageData.plz;
    }

    // for /geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer-sekundaer
    if (typeof userDataWithPageData?.postleitzahlBeklagtePerson === "string") {
      dataListArgument = userDataWithPageData.postleitzahlBeklagtePerson;
    }

    // for /geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person
    if (typeof userDataWithPageData?.postleitzahlSecondary === "string") {
      dataListArgument = userDataWithPageData.postleitzahlSecondary;
    }

    if (dataListArgument) {
      element.dataListArgument = dataListArgument;
    }
  }
};

export const buildFormElements = (
  { formContent, heading }: CMSContent,
  userDataWithPageData: UserDataWithPageData,
) =>
  formContent.map((element) => {
    if (element.__component === "form-elements.select" && heading)
      element.altLabel = heading;

    addDataListArgumentToAutoSuggestionInput(element, userDataWithPageData);

    return element;
  });
