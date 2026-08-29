import merge from "lodash/merge";
import type { UserData } from "~/domains/userData";

export type PageData = {
  arrayIndexes?: number[];
  arraySummaryFocusItem?: number;
  subflowDoneStates?: Record<string, boolean>;
};

export function firstArrayIndex(pageData?: PageData) {
  if (!pageData?.arrayIndexes) return undefined;
  return pageData.arrayIndexes.at(0);
}

export function isValidArrayIndex(
  array: unknown[] | undefined,
  pageData?: PageData,
) {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined || arrayIndex < 0) return false;
  return arrayIndex == 0 || (array !== undefined && arrayIndex <= array.length);
}

export type UserDataWithPageData = UserData & { pageData: PageData };

export function addPageDataToUserData(
  userData: UserData,
  pageData: PageData,
): UserDataWithPageData {
  return merge(userData, { pageData });
}
