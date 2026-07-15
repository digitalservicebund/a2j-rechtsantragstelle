import { type DataListType } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const autoSuggestZodDescription = "auto_suggest";

export const autoSuggestSchema = (dataList: DataListType) =>
  stringRequiredSchema.meta({
    description: autoSuggestZodDescription,
    type: dataList,
  });
