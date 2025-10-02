import type { useMatches } from "react-router";
import { isStrapiHero } from "../cms/models/content/isStrapiHero";
import type { StrapiContentComponent } from "../cms/models/formElements/StrapiContentComponent";
import type { StrapiMeta } from "../cms/models/StrapiMeta";

type RouteMatchKnown = Omit<ReturnType<typeof useMatches>[0], "loaderData"> & {
  loaderData: {
    meta?: StrapiMeta;
    content?: StrapiContentComponent[];
    pageTitle?: string;
  };
};

function isMatchesWithLoaderData(
  matches: ReturnType<typeof useMatches>,
): matches is RouteMatchKnown[] {
  return matches.every(({ loaderData }) => typeof loaderData === "object");
}

function headerTextFromContent(content?: StrapiContentComponent[]) {
  return content?.find(isStrapiHero)?.content?.html;
}

export function metaFromMatches(matches: ReturnType<typeof useMatches>) {
  if (!Array.isArray(matches) || !isMatchesWithLoaderData(matches)) {
    return {
      title: undefined,
      breadcrumbs: [],
      ogTitle: undefined,
      description: undefined,
    };
  }
  // can't use .at() due to old browsers
  const lastMatchData = matches[matches.length - 1].loaderData;

  return {
    // meta property only exists on content pages
    title: lastMatchData?.meta?.title ?? lastMatchData?.pageTitle,
    ogTitle: lastMatchData?.meta?.ogTitle,
    description:
      lastMatchData?.meta?.description ??
      headerTextFromContent(lastMatchData?.content),
  };
}
