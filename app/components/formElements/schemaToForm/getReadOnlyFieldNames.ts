import { getReadOnlyFields } from "~/domains/pageSchemas";
import { type UserData } from "~/domains/userData";

export const getReadOnlyFieldNames = (
  pathname: string,
  userData: UserData,
): string[] => {
  const readOnlyFields = getReadOnlyFields(pathname);

  if (!readOnlyFields) {
    return [];
  }

  return readOnlyFields.shouldMakeReadOnly(userData)
    ? readOnlyFields.fields
    : [];
};
