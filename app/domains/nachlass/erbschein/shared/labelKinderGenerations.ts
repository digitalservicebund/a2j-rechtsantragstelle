import { FIRST_ORDER_LABELS } from "~/domains/nachlass/erbschein/shared/erbfolgeLabels";
import type { SummaryItem } from "~/services/summary/types";

// The summary puts every kinder generation into one array group keyed by the
// base field name. Each item carries an arrayBoxKey like "kinder-0-kinder-2"
// whose numeric segments give the nesting depth (1 is Kind, 2 is Enkelkind).
const KINDER_GROUP_ID = "kinder";

function boxKeyDepth(arrayBoxKey?: string): number {
  if (!arrayBoxKey) return 1;
  const depth = arrayBoxKey
    .split("-")
    .filter((part) => /^\d+$/.test(part)).length;
  return depth === 0 ? 1 : depth;
}

// Labels each kinder item by its generation (Kind, Enkelkind, ...), numbered
// within that generation. Lives in the domain so the generic summary stays
// free of generation knowledge.
export function labelKinderGenerations(sections: SummaryItem[]): SummaryItem[] {
  return sections.map((section) => {
    if (!section.arrayGroups) return section;

    return {
      ...section,
      arrayGroups: section.arrayGroups.map((group) => {
        if (group.id !== KINDER_GROUP_ID) return group;

        const countPerGeneration: Record<number, number> = {};
        return {
          ...group,
          items: group.items.map((item) => {
            const depth = boxKeyDepth(item.arrayBoxKey);
            countPerGeneration[depth] = (countPerGeneration[depth] ?? 0) + 1;
            const label =
              FIRST_ORDER_LABELS[depth - 1] ?? FIRST_ORDER_LABELS.at(-1)!;
            return { ...item, title: `${label} ${countPerGeneration[depth]}` };
          }),
        };
      }),
    };
  });
}
