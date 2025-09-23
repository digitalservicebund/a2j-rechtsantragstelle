import { type Params } from "react-router";
import { type UserData } from "~/domains/userData";
import {
  fetchFlowPage,
  fetchMeta,
  fetchMultipleTranslations,
} from "~/services/cms/index.server";
import { buildCmsContentAndTranslations } from "~/services/flow/formular/buildCmsContentAndTranslations";
import { parentFromParams } from "~/services/params";
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

  const [formPageContent, parentMeta, cmsTranslations] = await Promise.all([
    fetchFlowPage("form-flow-pages", flowId, stepId),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
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

  const { translations, cmsContent, meta } = buildCmsContentAndTranslations({
    flowTranslations: cmsTranslations[flowId],
    flowMenuTranslations: cmsTranslations[`${flowId}/menu`],
    overviewTranslations: cmsTranslations[`${flowId}/summaryPage`],
    formPageContent,
    replacements,
    parentMeta,
  });

  return getContentData(
    { cmsContent, translations, meta, currentFlow },
    userDataWithPageData,
  );
};
