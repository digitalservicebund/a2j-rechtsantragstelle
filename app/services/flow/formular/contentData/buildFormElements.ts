import type z from "zod";
import type { UserDataWithPageData } from "../../pageData";
import { type CMSContent } from "../buildCmsContentAndTranslations";
import { type StrapiAutoSuggestInputComponentSchema } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";

const getDataListArgumentForVerstorbeneAdresseStrasse = (
  userDataWithPageData: UserDataWithPageData,
) => {
  // for /nachlass/erbausschlagung/anfrage/verstorbene/pflegeheim-plz
  if (typeof userDataWithPageData?.plzPflegeheim === "string") {
    return userDataWithPageData.plzPflegeheim;
  }

  // for /nachlass/erbausschlagung/anfrage/verstorbene/plz-vor-hospiz
  if (typeof userDataWithPageData?.plzBeforeHospiz === "string") {
    return userDataWithPageData.plzBeforeHospiz;
  }

  // for /nachlass/erbausschlagung/anfrage/verstorbene/plz
  if (typeof userDataWithPageData?.plzVerstorbene === "string") {
    return userDataWithPageData.plzVerstorbene;
  }
};

const addDataListArgumentToAutoSuggestionInput = (
  autoSuggestProps: z.infer<typeof StrapiAutoSuggestInputComponentSchema>,
  userDataWithPageData: UserDataWithPageData,
) => {
  let dataListArgument = undefined;

  if (typeof userDataWithPageData?.plz === "string") {
    dataListArgument = userDataWithPageData.plz;
  }

  if (autoSuggestProps.name === "verstorbeneAdresseStrasse") {
    dataListArgument =
      getDataListArgumentForVerstorbeneAdresseStrasse(userDataWithPageData);
  }

  if (
    autoSuggestProps.name === "ausschlagendePersonStrasse" &&
    typeof userDataWithPageData?.ausschlagendePersonPlz === "string"
  ) {
    dataListArgument = userDataWithPageData.ausschlagendePersonPlz;
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

    return element;
  });
