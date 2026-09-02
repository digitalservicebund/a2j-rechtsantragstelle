import type { SummaryFieldOverride } from "~/domains/flows.server";
import { resolveParentOptions, BOTH_PARENTS_VALUE } from "./buildParentOptions";
import { nachlassTranslations } from "~/services/translations/domains/nachlass";
import { commonTranslations } from "~/services/translations/common";

const parentIndexSubFields = new Set([
  "parentKindIndex",
  "parentElternteilIndex",
]);

/**
 * parentKindIndex/parentElternteilIndex (i.e. which parent a given descendant
 * belongs to) are purely metadata and have no CMS label. Display them as
 * "Kind von: <Elternname>" instead of the raw stored index and label.
 */
export const getParentIndexSummaryOverride: SummaryFieldOverride = (
  fieldInfo,
  rawValue,
  userData,
) => {
  if (
    !fieldInfo.subFieldName ||
    !parentIndexSubFields.has(fieldInfo.subFieldName)
  ) {
    return undefined;
  }

  const fieldName = `${fieldInfo.segments
    .map((segment) => segment.fieldName)
    .join("#")}#${fieldInfo.subFieldName}`;
  const arrayIndexes = fieldInfo.segments.map((segment) => segment.arrayIndex);
  const chosenValue = typeof rawValue === "string" ? rawValue : undefined;

  const options = resolveParentOptions(fieldName, userData, arrayIndexes);
  const parentName =
    chosenValue === BOTH_PARENTS_VALUE
      ? options.find((option) => option.value === BOTH_PARENTS_VALUE)?.text
      : options.find((option) => option.value === chosenValue)?.text;

  return {
    question: nachlassTranslations.nachlass.childOf.de,
    answer: parentName ?? commonTranslations.common.noInformationAvailable.de,
  };
};
