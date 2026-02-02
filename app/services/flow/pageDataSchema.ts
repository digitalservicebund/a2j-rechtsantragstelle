import { z } from "zod";

export const pageDataSchema = z.object({
  arrayIndexes: z.array(z.number()),
});

export type PageData = z.infer<typeof pageDataSchema>;

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
