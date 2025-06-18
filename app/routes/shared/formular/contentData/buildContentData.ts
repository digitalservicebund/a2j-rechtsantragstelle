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
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { getContentData } from "./getContentData";
import { getPageAndFlowDataFromRequest } from "../userDataAndFlow/getPageAndFlowDataFromRequest";

export const buildContentData = async (
  request: Request,
  params: Params<string>,
  userDataWithPageData: UserData & {
    pageData: {
      arrayIndexes: number[];
    };
  },
) => {
  const { pathname } = new URL(request.url);

  const { flowId, stepId, currentFlow } =
    getPageAndFlowDataFromRequest(request);
  const cookieHeader = request.headers.get("Cookie");

  const [formPageContent, parentMeta, translations, migrationData] =
    await Promise.all([
      fetchFlowPage("form-flow-pages", flowId, stepId),
      fetchMeta({ filterValue: parentFromParams(pathname, params) }),
      fetchMultipleTranslations([
        `${flowId}/menu`,
        "defaultTranslations",
        flowId,
        `${flowId}/summaryPage`,
        "accessibility",
      ]),
      getMigrationData(stepId, flowId, currentFlow, cookieHeader),
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
    migrationData,
    stringTranslations,
    translations,
    userDataWithPageData,
  );
};
