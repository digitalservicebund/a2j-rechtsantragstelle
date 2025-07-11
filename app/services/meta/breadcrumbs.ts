import type { Breadcrumb } from "~/components/Breadcrumbs";
import { fetchMeta } from "../cms/index.server";

// Splits pathname into its components, ie "/a/b/c" => [/a, /a/b, /a/b/c]
const pathComponents = (pathname: string) =>
  pathname
    .split("/")
    .filter((val) => val !== "")
    .map((_, index, arr) => "/" + arr.slice(0, index + 1).join("/"));

export const buildBreadcrumbPromises = (
  pathname: string,
): Promise<Breadcrumb[]> =>
  Promise.all(
    pathComponents(pathname).map((url) =>
      fetchMeta({ filterValue: url }).then((meta) => ({
        url,
        title: meta?.breadcrumb ?? undefined,
      })),
    ),
  );
