import type { StrapiFlowMeta } from "../cms/models/StrapiMeta";

export function stepMeta(
  pageMeta: StrapiFlowMeta,
  parentMeta: StrapiFlowMeta | null,
) {
  // The breadcrumb should not contain the current step title
  // Also, the parent page title needs to be appended manually to the title
  return {
    breadcrumb: parentMeta?.breadcrumb,
    title: `${pageMeta.title} - ${parentMeta?.title ?? ""}`,
  };
}
