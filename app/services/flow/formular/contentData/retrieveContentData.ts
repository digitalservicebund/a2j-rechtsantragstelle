import { type Params } from "react-router";
import { type UserData } from "~/domains/userData";
import {
  fetchFlowPage,
  fetchMultipleTranslations,
} from "~/services/cms/index.server";
import { buildCmsContentAndTranslations } from "~/services/flow/formular/buildCmsContentAndTranslations";
import { getContentData } from "./getContentData";
import { getPageAndFlowDataFromPathname } from "../../getPageAndFlowDataFromPathname";
import { type UserDataWithPageData } from "../../pageData";
import { replacementsFromFlowConfig } from "~/util/applyStringReplacement";

export const retrieveContentData = async (
  pathname: string,
  params: Params<string>,
  userDataWithPageData: UserDataWithPageData,
  migrationData?: UserData,
) => {
  const { flowId, stepId, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);

  const [formPageContent, cmsTranslations] = await Promise.all([
    fetchFlowPage("form-flow-pages", flowId, stepId),
    fetchMultipleTranslations([
      `${flowId}/menu`,
      flowId,
      `${flowId}/summaryPage`,
    ]),
  ]);

  const replacements = replacementsFromFlowConfig(
    currentFlow.stringReplacements,
    {
      // The migration overview page displays additional data that is not yet present in userData
      // To show user-friendly strings, we need to merge migrationData into userData
      ...userDataWithPageData,
      ...(migrationData ?? {}),
    },
  );

  const { translations, cmsContent } = await buildCmsContentAndTranslations({
    flowTranslations: cmsTranslations[flowId],
    flowMenuTranslations: cmsTranslations[`${flowId}/menu`],
    overviewTranslations: cmsTranslations[`${flowId}/summaryPage`],
    formPageContent,
    replacements,
    flowId,
  });

  return getContentData({ cmsContent, translations }, userDataWithPageData);
};
