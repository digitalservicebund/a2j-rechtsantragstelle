import _ from "lodash";
import { z } from "zod";
import type { Context } from "~/models/flows/contexts";

export const pageDataSchema = z.object({
  arrayIndexes: z.array(z.number()),
});

export function addPageDataToUserData(
  userData: Context,
  pageData: z.infer<typeof pageDataSchema>,
) {
  return _.merge(userData, { pageData });
}
