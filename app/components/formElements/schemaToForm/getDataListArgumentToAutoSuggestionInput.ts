import { type z } from "zod";
import { type UserData } from "~/domains/userData";
import { type DataListType } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";
import { arrayIsNonEmpty } from "~/util/array";

export const getDataListArgumentToAutoSuggestionInput = (
  fieldSchema: z.ZodType,
  userData: UserData,
) => {
  const dataListType = fieldSchema.meta()?.type as DataListType;
  const dataListArguments = fieldSchema.meta()?.dataListArguments as string[];

  if (dataListType !== "streetNames" || !arrayIsNonEmpty(dataListArguments)) {
    return "";
  }

  const zipCodeFieldNamesReference = dataListArguments.find(
    (fieldName) =>
      typeof userData[fieldName] === "string" && userData[fieldName].length > 0,
  );

  if (!zipCodeFieldNamesReference) {
    return "";
  }

  return userData[zipCodeFieldNamesReference] as string;
};
