import type z from "zod";
import type { UserDataWithPageData } from "../../pageData";
import { type CMSContent } from "../buildCmsContentAndTranslations";
import { type StrapiAutoSuggestInputComponentSchema } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";

const addDataListArgumentToAutoSuggestionInput = (
  autoSuggestProps: z.infer<typeof StrapiAutoSuggestInputComponentSchema>,
  userDataWithPageData: UserDataWithPageData,
) => {
  let dataListArgument = undefined;

  if (typeof userDataWithPageData?.plz === "string") {
    dataListArgument = userDataWithPageData.plz;
  }

  // for /erbschein/nachlassgericht/plz-lebensmittelpunkt
  if (typeof userDataWithPageData?.plzLebensmittelpunkt === "string") {
    dataListArgument = userDataWithPageData.plzLebensmittelpunkt;
  }

  // for /erbschein/nachlassgericht/plz-hospiz
  if (typeof userDataWithPageData?.plzHospiz === "string") {
    dataListArgument = userDataWithPageData.plzHospiz;
  }

  // for /erbschein/nachlassgericht/plz-pflegeheim
  if (typeof userDataWithPageData?.plzPflegeheim === "string") {
    dataListArgument = userDataWithPageData.plzPflegeheim;
  }

  // for /geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person
  if (
    autoSuggestProps.name === "strasseBeklagte" &&
    typeof userDataWithPageData?.postleitzahlBeklagtePerson === "string"
  ) {
    dataListArgument = userDataWithPageData.postleitzahlBeklagtePerson;
  }
  // for /geld-einklagen/formular/gericht-pruefen/gericht-suchen/strasse-nummer
  if (
    autoSuggestProps.name === "strasseSekundaer" &&
    typeof userDataWithPageData?.postleitzahlSecondary === "string"
  ) {
    dataListArgument = userDataWithPageData.postleitzahlSecondary;
  }

  if (dataListArgument) {
    autoSuggestProps.dataListArgument = dataListArgument;
  }
};

function parseCount(countValue: unknown): number {
  if (typeof countValue === "string") {
    return Number.parseInt(countValue, 10);
  }
  if (typeof countValue === "number") {
    return countValue;
  }
  return 0;
}

export const buildFormElements = (
  { formContent, heading }: CMSContent,
  userDataWithPageData: UserDataWithPageData,
) =>
  formContent.map((element) => {
    if (element.__component === "form-elements.select" && heading)
      element.altLabel = heading;
    if (
      element.__component === "form-elements.auto-suggest-input" &&
      element.dataList === "streetNames"
    ) {
      addDataListArgumentToAutoSuggestionInput(element, userDataWithPageData);
    }

    // Inject count for multi-item-input components
    if (element.__component === "form-elements.multi-item-input") {
      if (element.countField) {
        const countValue = userDataWithPageData?.[element.countField];
        element.count = parseCount(countValue);
      }
    }

    return element;
  });
