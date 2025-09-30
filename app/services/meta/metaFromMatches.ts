import type { useMatches } from "react-router";
import { isStrapiHero } from "../cms/models/content/isStrapiHero";
import type { StrapiContentComponent } from "../cms/models/formElements/StrapiContentComponent";
import type { StrapiMeta } from "../cms/models/StrapiMeta";
import type { FlowPageId } from "../cms/schemas";

type RouteMatchKnown = Omit<ReturnType<typeof useMatches>[0], "loaderData"> & {
  loaderData: { meta?: StrapiMeta; content?: StrapiContentComponent[] };
};

function isMatchesWithLoaderData(
  matches: ReturnType<typeof useMatches>,
): matches is RouteMatchKnown[] {
  return matches.every(({ loaderData }) => typeof loaderData === "object");
}

function headerTextFromContent(content?: StrapiContentComponent[]) {
  return content?.find(isStrapiHero)?.content?.html;
}

function getPageTitle(data: {
  meta?: StrapiMeta;
  content?: StrapiContentComponent[];
  pageType?: FlowPageId;
  pageTitle?: string;
}) {
  if (
    data.pageType === "form-flow-pages" ||
    data.pageType === "vorab-check-pages" ||
    data.pageType === "result-pages"
  ) {
    return data.pageTitle;
  }
  return data.meta?.title;
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
  const title = getPageTitle(lastMatchData);

  return {
    title,
    ogTitle: lastMatchData?.meta?.ogTitle,
    description:
      lastMatchData?.meta?.description ??
      headerTextFromContent(lastMatchData?.content),
  };
}
