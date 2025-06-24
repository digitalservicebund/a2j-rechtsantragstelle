import { isStrapiArraySummary } from "~/services/cms/models/isStrapiArraySummary";
import { type StrapiFormFlowPage } from "../cms/models/StrapiFormFlowPage";

export const getArrayCategoriesFromPageContent = (
  formPageContent: StrapiFormFlowPage,
) => {
  return formPageContent.pre_form
    .filter(isStrapiArraySummary)
    .map((strapiSummary) => strapiSummary.category);
};
