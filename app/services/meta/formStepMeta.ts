import type { StrapiMeta } from "../cms/models/StrapiMeta";

export function stepMeta(pageMeta: StrapiMeta, parentMeta: StrapiMeta | null) {
  // The breadcrumb should not contain the current step title
  // Also, the parent page title needs to be appended manually to the title
  return {
    description: pageMeta.description ?? parentMeta?.description,
    breadcrumb: parentMeta?.breadcrumb,
    ogTitle: pageMeta.ogTitle ?? parentMeta?.ogTitle,
    title: `${pageMeta.title} - ${parentMeta?.title ?? ""}`,
  };
}
