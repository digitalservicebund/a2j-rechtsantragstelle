import { type Params } from "react-router";
import { type UserData } from "~/domains/userData";
import {
  fetchFlowPage,
  fetchContentPageMeta,
  fetchMultipleTranslations,
} from "~/services/cms/index.server";
import { buildCmsContentAndTranslations } from "~/services/flow/contentData/buildCmsContentAndTranslations";
import { parentFromParams } from "~/services/params";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { type UserDataWithPageData } from "../pageData";
import { replacementsFromFlowConfig } from "~/util/applyStringReplacement";
import { getContentData } from "../contentData/getContentData";

export const retrieveContentData = async (
  flowPageId: "vorab-check-pages" | "form-flow-pages",
  pathname: string,
  params: Params<string>,
  userDataWithPageData: UserDataWithPageData,
  migrationData?: UserData,
) => {
  const { flowId, stepId, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);

  const [formPageContent, parentContentPageMeta, cmsTranslations] =
    await Promise.all([
      fetchFlowPage(flowPageId, flowId, stepId.replaceAll("/#", "")),
      fetchContentPageMeta({ filterValue: parentFromParams(pathname, params) }),
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
      ...migrationData,
    },
  );

  const { translations, cmsContent } = buildCmsContentAndTranslations({
    flowTranslations: cmsTranslations[flowId],
    flowMenuTranslations: cmsTranslations[`${flowId}/menu`],
    overviewTranslations: cmsTranslations[`${flowId}/summaryPage`],
    formPageContent,
    replacements,
    parentMeta: parentContentPageMeta,
  });

  return getContentData(
    { cmsContent, translations },
    userDataWithPageData,
    pathname,
  );
};
