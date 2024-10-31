import _ from "lodash";
import type { Context } from "~/domains/contexts";
import { type PageData } from "./pageDataSchema";

export function addPageDataToUserData(userData: Context, pageData: PageData) {
  return _.merge(userData, { pageData });
}
