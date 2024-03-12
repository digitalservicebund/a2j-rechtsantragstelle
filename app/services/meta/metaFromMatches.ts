import type { useMatches } from "@remix-run/react";
import { isStrapiHeader } from "../cms/models/StrapiHeader";
import type { StrapiContent } from "../cms/models/StrapiContent";
import type { StrapiMeta } from "../cms/models/StrapiMeta";
import type { Breadcrumb } from "~/components/Breadcrumbs";

type RouteMatchKnown = Omit<ReturnType<typeof useMatches>[0], "data"> & {
  data: {
    meta: StrapiMeta | undefined;
    content: StrapiContent[] | undefined;
  };
};
function isMatchesWithDataObject(
  matches: ReturnType<typeof useMatches>,
): matches is RouteMatchKnown[] {
  return matches.every(({ data }) => typeof data === "object");
}

function headerTextFromContent(content?: StrapiContent[]) {
  return content?.find(isStrapiHeader)?.content?.text;
}

function breadcrumbFromMatch(match: RouteMatchKnown) {
  return {
    url: match.pathname,
    title: match.data.meta?.breadcrumb ?? match.data.meta?.title ?? "",
  } satisfies Breadcrumb;
}

export function metaFromMatches(matches: ReturnType<typeof useMatches>) {
  if (!isMatchesWithDataObject(matches)) {
    return {
      title: undefined,
      breadcrumbs: [],
      ogTitle: undefined,
      description: undefined,
    };
  }
  const lastMatchData = matches.at(-1)?.data;

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
