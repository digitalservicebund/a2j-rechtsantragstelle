import merge from "lodash/merge";
import type { Context } from "~/domains/userData";
import { type PageData } from "./pageDataSchema";

export function addPageDataToUserData(userData: Context, pageData: PageData) {
  return merge(userData, { pageData });
}
