import { LoaderExtras } from "~/services/flow/server/loaderExtras";
import { SummaryItem } from "~/services/summary/types";

function kindLabel(sections: SummaryItem[]): SummaryItem[] {
  return sections.map((section) => {
    if (!section.arrayGroups) return section;
    return {
      ...section,
      arrayGroups: section.arrayGroups.map((group) => {
        if (group.id !== "kinder") return group;
        return {
          ...group,
          items: group.items.map((item, index) => ({
            ...item,
            title: `Kind ${index + 1}`,
          })),
        };
      }),
    };
  });
}

export const erbausschlagungLoaderExtras = {
  transformAutoSummary: (sections) => {
    return kindLabel(sections);
  },
} satisfies LoaderExtras;
