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

    // for /erbschein/nachlassgericht/plz-wohnung-oder-haus
    if (typeof userDataWithPageData?.plzWohnungOderHaus === "string") {
      dataListArgument = userDataWithPageData.plzWohnungOderHaus;
    }

    // for /erbschein/nachlassgericht/plz-pflegeheim
    if (typeof userDataWithPageData?.plzPflegeheim === "string") {
      dataListArgument = userDataWithPageData.plzPflegeheim;
    }

    // for /erbschein/nachlassgericht/plz-hospiz
    if (typeof userDataWithPageData?.plzHospiz === "string") {
      dataListArgument = userDataWithPageData.plzHospiz;
    }

    // for /geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person
    if (
      element.name === "strasseBeklagte" &&
      typeof userDataWithPageData?.postleitzahlBeklagtePerson === "string"
    ) {
      dataListArgument = userDataWithPageData.postleitzahlBeklagtePerson;
    }
    // for /geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer
    if (
      element.name === "strasseSekundaer" &&
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
) =>
  formContent.map((element) => {
    if (element.__component === "form-elements.select" && heading)
      element.altLabel = heading;
    addDataListArgumentToAutoSuggestionInput(element, userDataWithPageData);

    return element;
  });
