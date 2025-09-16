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

export const retrieveContentData = async (
  pathname: string,
  params: Params<string>,
  userDataWithPageData: UserDataWithPageData,
  migrationData: UserData | undefined,
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

  const replacements =
    "stringReplacements" in currentFlow
      ? // oxlint-disable-line ban-ts-comment @ts-ignore
        currentFlow.stringReplacements({
          ...userDataWithPageData,
          ...(migrationData ?? {}),
        })
      : undefined;

  const { translations, cmsContent } = buildCmsContentAndTranslations({
    flowTranslations: cmsTranslations[flowId],
    flowMenuTranslations: cmsTranslations[`${flowId}/menu`],
    overviewTranslations: cmsTranslations[`${flowId}/summaryPage`],
    formPageContent,
    replacements,
  });

  return getContentData(
    {
      cmsContent,
      parentMeta,
      translations,
    },
    userDataWithPageData,
    replacements,
  );
};
