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
import { getPageAndFlowDataFromPathname } from "../userDataAndFlow/getPageAndFlowDataFromPathname";

export const buildContentData = async (
  pathname: string,
  params: Params<string>,
  userDataWithPageData: UserData & {
    pageData: {
      arrayIndexes: number[];
    };
  },
  migrationData: UserData | undefined,
) => {
  const { flowId, stepId, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);

  const [formPageContent, parentMeta, translations] = await Promise.all([
    fetchFlowPage("form-flow-pages", flowId, stepId),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
    fetchMultipleTranslations([
      `${flowId}/menu`,
      "defaultTranslations",
      flowId,
      `${flowId}/summaryPage`,
      "accessibility",
    ]),
  ]);

  const arrayCategories = getArrayCategoriesFromPageContent(formPageContent);

  const { stringTranslations, cmsContent } =
    await buildFormularServerTranslations({
      currentFlow,
      flowTranslations: translations[flowId],
      migrationData,
      arrayCategories,
      overviewTranslations: translations[`${flowId}/summaryPage`],
      formPageContent,
      userDataWithPageData,
    });

  return getContentData(
    cmsContent,
    parentMeta,
    formPageContent,
    stringTranslations,
    translations,
    userDataWithPageData,
    currentFlow,
  );
};
