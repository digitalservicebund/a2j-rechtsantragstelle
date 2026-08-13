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
import {
  replacementsFromFlowConfig,
  type Replacements,
} from "~/util/applyStringReplacement";
import { getContentData } from "../contentData/getContentData";

export const retrieveContentData = async (
  flowPageId: "vorab-check-pages" | "form-flow-pages",
  pathname: string,
  params: Params<string>,
  userDataWithPageData: UserDataWithPageData,
  migrationData?: UserData,
  // Extra text placeholders to fill into the CMS content, on top of the ones a
  // flow declares statically. Use this for values that depend on which page the
  // user is on (for example, the name of the specific list item they are inside),
  // which the static per-flow replacements cannot know. Applied last, so these
  // take priority. Optional: existing callers pass nothing and are unaffected.
  extraReplacements?: Replacements,
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

  const flowReplacements = replacementsFromFlowConfig(
    currentFlow.stringReplacements,
    {
      // The migration overview page displays additional data that is not yet present in userData
      // To show user-friendly strings, we need to merge migrationData into userData
      ...userDataWithPageData,
      ...migrationData,
    },
  );
  // Without extras this stays exactly what it was before (including undefined),
  // so every existing caller behaves identically.
  const replacements = extraReplacements
    ? { ...flowReplacements, ...extraReplacements }
    : flowReplacements;

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
