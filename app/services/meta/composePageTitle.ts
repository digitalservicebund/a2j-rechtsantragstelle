import type { StrapiMeta } from "../cms/models/StrapiMeta";

export function composePageTitle(
  pageTitle: string,
  parentContentPageMeta: StrapiMeta | null,
) {
  return `${pageTitle} - ${parentContentPageMeta?.title ?? ""}`;
}
