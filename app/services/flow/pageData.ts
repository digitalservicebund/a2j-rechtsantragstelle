import merge from "lodash/merge";
import type { UserData } from "~/domains/userData";
import { type PageData } from "./pageDataSchema";

export type UserDataWithPageData = UserData & { pageData: PageData };

export function addPageDataToUserData(
  userData: UserData,
  pageData: PageData,
): UserDataWithPageData {
  return merge(userData, { pageData });
}
