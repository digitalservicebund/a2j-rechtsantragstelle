import type { useMatches } from "react-router";
import type { Breadcrumb } from "~/components/Breadcrumbs";
import { isStrapiHero } from "../cms/models/isStrapiHero";
import type { StrapiContentComponent } from "../cms/models/StrapiContentComponent";
import type { StrapiMeta } from "../cms/models/StrapiMeta";

type RouteMatchKnown = Omit<ReturnType<typeof useMatches>[0], "data"> & {
  data: {
    meta: StrapiMeta | undefined;
    content: StrapiContentComponent[] | undefined;
  } | null;
};
function isMatchesWithDataObject(
  matches: ReturnType<typeof useMatches>,
): matches is RouteMatchKnown[] {
  return matches.every(({ data }) => typeof data === "object");
}

function headerTextFromContent(content?: StrapiContentComponent[]) {
  return content?.find(isStrapiHero)?.content?.html;
}

function breadcrumbFromMatch(match: RouteMatchKnown) {
  return {
    url: match.pathname,
    title: match.data?.meta?.breadcrumb ?? match.data?.meta?.title ?? "",
  } satisfies Breadcrumb;
}

export function metaFromMatches(matches: ReturnType<typeof useMatches>) {
  if (
    !Array.isArray(matches) ||
    !isMatchesWithDataObject(matches) ||
    !matches
  ) {
    return {
      title: undefined,
      breadcrumbs: [],
      ogTitle: undefined,
      description: undefined,
    };
  }
  // can't use .at() due to old browsers
  const lastMatchData = matches[matches.length - 1].data;

  return {
    breadcrumbs: matches
      .filter((m) => !m.id.includes("_index") && m.id !== "root")
      .map(breadcrumbFromMatch),
    title: lastMatchData?.meta?.title,
    ogTitle: lastMatchData?.meta?.ogTitle,
    description:
      lastMatchData?.meta?.description ??
      headerTextFromContent(lastMatchData?.content),
  };
}
