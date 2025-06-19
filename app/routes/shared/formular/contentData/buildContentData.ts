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
import { type CookieHeader } from "~/services/session.server";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { getContentData } from "./getContentData";
import { getPageAndFlowDataFromPathname } from "../userDataAndFlow/getPageAndFlowDataFromPathname";

export const buildContentData = async (
  pathname: string,
  cookieHeader: CookieHeader,
  params: Params<string>,
  userDataWithPageData: UserData & {
    pageData: {
      arrayIndexes: number[];
    };
  },
) => {
  const { flowId, stepId, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);

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
