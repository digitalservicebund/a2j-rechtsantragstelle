import { type KernBreadcrumb } from "~/components/kern/layout/KernBreadcrumbs";
import { fetchContentPageMeta } from "../cms/index.server";

// Splits pathname into its subpaths, ie "/a/b/c" => [/a, /a/b, /a/b/c]
const buildSubPaths = (pathname: string) =>
  pathname
    .split("/")
    .slice(1)
    .map((_, index, arr) => "/" + arr.slice(0, index + 1).join("/"));

export const buildBreadcrumbPromises = (
  pathname: string,
): Promise<KernBreadcrumb[]> =>
  Promise.all(
    buildSubPaths(pathname)
      .filter((path) => path !== "/")
      .map((url) =>
        fetchContentPageMeta({ filterValue: url }).then((meta) => ({
          url,
          title: meta?.breadcrumb ?? undefined,
        })),
      ),
  );
