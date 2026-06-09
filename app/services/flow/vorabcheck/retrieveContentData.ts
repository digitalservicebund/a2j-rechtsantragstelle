import { type Params } from "react-router";
import {
  fetchFlowPage,
  fetchContentPageMeta,
} from "~/services/cms/index.server";
import { buildCmsContentAndTranslations } from "~/services/flow/contentData/buildCmsContentAndTranslations";
import { parentFromParams } from "~/services/params";
import { replacementsFromFlowConfig } from "~/util/applyStringReplacement";
import { type UserDataWithPageData } from "../pageData";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { getContentData } from "../contentData/getContentData";

export const retrieveContentData = async (
  pathname: string,
  params: Params<string>,
  userDataWithPageData: UserDataWithPageData,
) => {
  const { flowId, stepId, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);

  const [formPageContent, parentContentPageMeta] = await Promise.all([
    fetchFlowPage("vorab-check-pages", flowId, stepId),
    fetchContentPageMeta({ filterValue: parentFromParams(pathname, params) }),
  ]);

  const replacements = replacementsFromFlowConfig(
    currentFlow.stringReplacements,
    userDataWithPageData,
  );

  const { translations, cmsContent } = buildCmsContentAndTranslations({
    flowTranslations: {},
    flowMenuTranslations: {},
    overviewTranslations: {},
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
