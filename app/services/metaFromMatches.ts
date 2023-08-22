import type { useMatches } from "@remix-run/react";
import type { StrapiHeader } from "./cms/models/StrapiHeader";
import type { StrapiContent } from "./cms/models/StrapiContent";
import type { StrapiMeta } from "./cms/models/StrapiMeta";

type RouteMatchKnown = Omit<ReturnType<typeof useMatches>[0], "data"> & {
  data: {
    meta: (StrapiMeta & { breadcrumbTitle?: string }) | undefined;
    content: StrapiContent[] | undefined;
  };
};

export function metaFromMatches(matches: RouteMatchKnown[]) {
  const breadcrumbs = matches
    .filter((m) => !m.id.match(/.*_index$/) && m.id !== "root")
    .map((m) => ({
      url: m.pathname,
      title: m.data.meta?.breadcrumbTitle ?? m.data.meta?.title ?? "",
    }));

  const title = matches
    .filter((m) => !m.id.match(/.*_index$/))
    .map((m) => m.data.meta?.title ?? "")
    .reverse()
    .join(" - ");

  const description =
    matches.at(-1)?.data.meta?.description ??
    (
      matches
        .at(-1)
        ?.data.content?.find((c) => c.__component === "page.header") as
        | StrapiHeader
        | undefined
    )?.content?.text;

  return { breadcrumbs, title, description };
}
