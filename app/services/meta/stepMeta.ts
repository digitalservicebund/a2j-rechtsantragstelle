import type { StrapiMeta } from "../cms/models/StrapiMeta";

export function stepMeta(pageMeta: StrapiMeta, parentMeta: StrapiMeta | null) {
  return {
    description: pageMeta.description ?? parentMeta?.description,
    ogTitle: pageMeta.ogTitle ?? parentMeta?.ogTitle,
    title: `${pageMeta.title} - ${parentMeta?.title ?? ""}`,
  };
}
