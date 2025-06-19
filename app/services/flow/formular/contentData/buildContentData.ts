import { type Params } from "react-router";
import { type UserData } from "~/domains/userData";
import { getArrayCategoriesFromPageContent } from "~/services/array/getArrayCategoriesFromPageContent";
import {
  fetchFlowPage,
  fetchMeta,
  fetchMultipleTranslations,
} from "~/services/cms/index.server";
import { buildFormularServerTranslations } from "~/services/flow/formular/buildFormularServerTranslations";
import { parentFromParams } from "~/services/params";
import { getContentData } from "./getContentData";
import { getPageAndFlowDataFromPathname } from "../../getPageAndFlowDataFromPathname";
import { type UserDataWithPageData } from "../../pageData";

export const buildContentData = async (
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

  const arrayCategories = getArrayCategoriesFromPageContent(formPageContent);

  const { translations, cmsContent } = await buildFormularServerTranslations({
    currentFlow,
    flowTranslations: cmsTranslations[flowId],
    flowMenuTranslations: cmsTranslations[`${flowId}/menu`],
    migrationData,
    arrayCategories,
    overviewTranslations: cmsTranslations[`${flowId}/summaryPage`],
    formPageContent,
    userDataWithPageData,
  });

  return getContentData(
    {
      cmsContent,
      parentMeta,
      formPageContent,
      translations,
    },
    userDataWithPageData,
    currentFlow,
  );
};
