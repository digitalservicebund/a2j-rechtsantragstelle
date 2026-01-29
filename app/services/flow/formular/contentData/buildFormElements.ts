import type { UserDataWithPageData } from "../../pageData";
import { type CMSContent } from "../buildCmsContentAndTranslations";

type FormElement = CMSContent["formContent"][number];

const addDataListArgumentToAutoSuggestionInput = (
  element: FormElement,
  userDataWithPageData: UserDataWithPageData,
  pathname?: string,
) => {
  if (
    element.__component === "form-elements.auto-suggest-input" &&
    element.dataList === "streetNames"
  ) {
    let dataListArgument = undefined;

    if (typeof userDataWithPageData?.plz === "string") {
      dataListArgument = userDataWithPageData.plz;
    }

    // for /geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person
    if (
      pathname ===
        "/geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person" &&
      typeof userDataWithPageData?.postleitzahlBeklagtePerson === "string"
    ) {
      dataListArgument = userDataWithPageData.postleitzahlBeklagtePerson;
    }
    // for /geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer
    if (
      pathname ===
        "/geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer" &&
      typeof userDataWithPageData?.postleitzahlSecondary === "string"
    ) {
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
  pathname: string,
) =>
  formContent.map((element) => {
    if (element.__component === "form-elements.select" && heading)
      element.altLabel = heading;
    console.log("pathname in buildFormElements:", pathname);
    addDataListArgumentToAutoSuggestionInput(
      element,
      userDataWithPageData,
      pathname,
    );

    return element;
  });
