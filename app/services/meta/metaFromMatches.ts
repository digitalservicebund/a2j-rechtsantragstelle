import type { useMatches } from "@remix-run/react";
import type { StrapiHeader } from "../cms/models/StrapiHeader";
import type { StrapiContentComponent } from "../cms/models/StrapiContentComponent";
import type { StrapiMeta } from "../cms/models/StrapiMeta";

type RouteMatchKnown = Omit<ReturnType<typeof useMatches>[0], "data"> & {
  data: {
    meta: (StrapiMeta & { breadcrumbTitle?: string }) | undefined;
    content: StrapiContentComponent[] | undefined;
  };
};
function isMatchesWithDataObject(
  matches: ReturnType<typeof useMatches>,
): matches is RouteMatchKnown[] {
  return matches.every(({ data }) => typeof data === "object");
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

  const breadcrumbs = matches
    .filter((m) => !/.*_index$/.exec(m.id) && m.id !== "root")
    .map((m) => ({
      url: m.pathname,
      title: m.data.meta?.breadcrumbTitle ?? m.data.meta?.title ?? "",
    }));

  const title = matches.at(-1)?.data.meta?.title;
  const ogTitle = matches.at(-1)?.data.meta?.ogTitle;

  const description =
    matches.at(-1)?.data.meta?.description ??
    (
      matches
        .at(-1)
        ?.data.content?.find((c) => c.__component === "page.header") as
        | StrapiHeader
        | undefined
    )?.content?.text;

  return { breadcrumbs, title, ogTitle, description };
}
