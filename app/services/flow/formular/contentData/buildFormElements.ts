import type z from "zod";
import type { UserDataWithPageData } from "../../pageData";
import { type CMSContent } from "../buildCmsContentAndTranslations";
import { type StrapiAutoSuggestInputComponentSchema } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";
import { type FlowId } from "~/domains/flowIds";

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

const getDataListArgumentForErbscheinNachlassgericht = (
  userDataWithPageData: UserDataWithPageData,
) => {
  // for /erbschein/nachlassgericht/plz-lebensmittelpunkt
  if (typeof userDataWithPageData?.plzLebensmittelpunkt === "string") {
    return userDataWithPageData.plzLebensmittelpunkt;
  }

  // for /erbschein/nachlassgericht/plz-hospiz
  if (typeof userDataWithPageData?.plzHospiz === "string") {
    return userDataWithPageData.plzHospiz;
  }

  // for /erbschein/nachlassgericht/plz-pflegeheim
  if (typeof userDataWithPageData?.plzPflegeheim === "string") {
    return userDataWithPageData.plzPflegeheim;
  }
};

const addDataListArgumentToAutoSuggestionInput = (
  autoSuggestProps: z.infer<typeof StrapiAutoSuggestInputComponentSchema>,
  userDataWithPageData: UserDataWithPageData,
  flowId: FlowId,
) => {
  let dataListArgument = undefined;

  if (typeof userDataWithPageData?.plz === "string") {
    dataListArgument = userDataWithPageData.plz;
  }

  if (
    flowId === "/nachlass/erbausschlagung/anfrage" &&
    autoSuggestProps.name === "verstorbeneAdresseStrasse"
  ) {
    dataListArgument =
      getDataListArgumentForVerstorbeneAdresseStrasse(userDataWithPageData);
  }

  if (
    flowId === "/nachlass/erbausschlagung/anfrage" &&
    autoSuggestProps.name === "ausschlagendePersonStrasse" &&
    typeof userDataWithPageData?.ausschlagendePersonPlz === "string"
  ) {
    dataListArgument = userDataWithPageData.ausschlagendePersonPlz;
  }

  if (
    flowId === "/nachlass/erbschein/nachlassgericht" &&
    autoSuggestProps.name === "strasse"
  ) {
    dataListArgument =
      getDataListArgumentForErbscheinNachlassgericht(userDataWithPageData);
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
  flowId: FlowId,
) =>
  formContent.map((element) => {
    if (element.__component === "form-elements.select" && heading)
      element.altLabel = heading;
    if (
      element.__component === "form-elements.auto-suggest-input" &&
      element.dataList === "streetNames"
    ) {
      addDataListArgumentToAutoSuggestionInput(
        element,
        userDataWithPageData,
        flowId,
      );
    }

    return element;
  });
