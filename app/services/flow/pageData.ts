import merge from "lodash/merge";
import type { UserData } from "~/domains/userData";
import { type PageData } from "./pageDataSchema";

export function addPageDataToUserData(userData: UserData, pageData: PageData) {
  return merge(userData, { pageData });
}
