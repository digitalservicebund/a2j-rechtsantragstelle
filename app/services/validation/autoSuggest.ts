import { type DataListType } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";
import type { ZodType } from "zod";
import { stringRequiredSchema } from "./stringRequired";

export const autoSuggestZodDescription = "auto_suggest";

export const autoSuggestSchema =
  <T extends ZodType>(schema: T) =>
  (dataList: DataListType) =>
    schema.meta({
      description: autoSuggestZodDescription,
      type: dataList,
    });

export const autoSuggestStringRequiredSchema = (dataList: DataListType) =>
  stringRequiredSchema.meta({
    description: autoSuggestZodDescription,
    type: dataList,
  });
