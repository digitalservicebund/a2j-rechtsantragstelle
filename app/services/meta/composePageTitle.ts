import { fetchContentPageMeta } from "../cms/index.server";
import { buildSubPaths } from "./breadcrumbs";

const buildTitlePromises = (
  pathname: string,
): Promise<Array<string | undefined>> =>
  Promise.all(
    buildSubPaths(pathname).map((url) =>
      fetchContentPageMeta({ filterValue: url }).then((meta) => meta?.title),
    ),
  );

export async function composePageTitle(
  pageTitle: string,
  flowId: string,
): Promise<string> {
  const parentMetaTitles = await buildTitlePromises(flowId);
  const filteredTitles = parentMetaTitles.filter(Boolean).reverse();
  return `${[pageTitle, ...filteredTitles].join(" - ")} | Justiz-Services`;
}
