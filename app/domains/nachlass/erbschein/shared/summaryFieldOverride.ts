import type { SummaryFieldOverride } from "~/domains/flows.server";
import { resolveParentOptions, BOTH_PARENTS_VALUE } from "./buildParentOptions";
import { type ElternteilKindFields } from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

const parentIndexSubFields = new Set<keyof ElternteilKindFields>([
  "parentKindIndex",
  "parentElternteilIndex",
]);

/**
 * parentKindIndex/parentElternteilIndex (i.e. which parent a given descendant
 * belongs to) are purely metadata and have no CMS label. Display them as
 * "Kind von: <Elternname>" instead of the raw stored index and label.
 */
export const resolveParentIndexSummaryOverride: SummaryFieldOverride = (
  fieldInfo,
  rawValue,
  userData,
) => {
  if (
    !fieldInfo.subFieldName ||
    !parentIndexSubFields.has(
      fieldInfo.subFieldName as keyof ElternteilKindFields,
    )
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
    question: "Kind von",
    answer: parentName ?? "Keine Angabe",
  };
};
