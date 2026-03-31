import { type ReadOnlyFields } from "~/domains/pageSchemas";
import { type UserData } from "~/domains/userData";

export const getReadOnlyFieldNames = (
  readOnlyFields: ReadOnlyFields | undefined,
  userData: UserData,
): string[] => {
  if (!readOnlyFields) {
    return [];
  }

  if (readOnlyFields.shouldMakeReadOnly(userData)) {
    return readOnlyFields.fields;
  }

  return [];
};
