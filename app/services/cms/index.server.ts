import type { FlowId } from "~/flows/flowIds";
import type { Filter, GetStrapiEntryOpts } from "./filters";
import { getStrapiEntry } from "./getStrapiEntry";
import { HasStrapiMetaSchema } from "./models/HasStrapiMeta";
import type { StrapiPage } from "./models/StrapiPage";
import {
  collectionSchemas,
  entrySchemas,
  type CollectionId,
  type FlowPageId,
  type SingleEntryId,
  type StrapiSchemas,
} from "./schemas";
import { httpErrorCodes } from "../errorPages/ErrorBox";

export type Translations = Record<string, string>;

export async function fetchMeta(
  opts: Omit<GetStrapiEntryOpts, "apiId" | "filter"> & { filterValue: string },
) {
  const populate = "meta";
  const filters = [{ value: opts.filterValue, field: "slug" }];
  const apiId = "pages";
  const pageEntry = await getStrapiEntry({ ...opts, filters, apiId, populate });
  const parsedEntry = HasStrapiMetaSchema.safeParse(pageEntry[0]?.attributes);
  return parsedEntry.success ? parsedEntry.data.meta : null;
}

export async function fetchSingleEntry<T extends SingleEntryId>(
  apiId: T,
): Promise<StrapiSchemas[T][number]["attributes"]> {
  const strapiEntry = await getStrapiEntry({ apiId });
  return entrySchemas[apiId].parse(strapiEntry)[0].attributes;
}

async function fetchCollectionEntry<T extends CollectionId>(
  apiId: T,
  filters?: Filter[],
): Promise<StrapiSchemas[T][number]["attributes"]> {
  const strapiEntry = await getStrapiEntry({ apiId, filters });
  const strapiEntryParsed = collectionSchemas[apiId].safeParse(strapiEntry);

  if (!strapiEntryParsed.success || strapiEntryParsed.data.length === 0) {
    const error = new Error(
      `CMS lookup for ${apiId} failed (filters: ${JSON.stringify(filters)})`,
    );
    error.name = "StrapiPageNotFound";
    throw error;
  }
  return strapiEntryParsed.data[0].attributes;
}

export const fetchTranslations = async (
  name: string,
): Promise<Translations> => {
  const filters = [{ field: "scope", value: name }];
  try {
    const entry = await fetchCollectionEntry("translations", filters);
    if (!entry) return {};
    return Object.fromEntries(
      entry.field.map(({ name, value }) => [name, value]),
    );
  } catch {
    return {};
  }
};

export const fetchPage = (slug: string) =>
  fetchCollectionEntry("pages", [{ field: "slug", value: slug }]);

export const fetchFlowPage = <T extends FlowPageId>(
  collection: T,
  flowId: FlowId,
  stepId: string,
): Promise<StrapiSchemas[T][number]["attributes"]> =>
  fetchCollectionEntry(collection, [
    { field: "stepId", value: "/" + stepId }, // TODO: align stepid between app & cms
    { field: "flow_ids", nestedField: "flowId", value: flowId },
  ]);

export const strapiPageFromRequest = ({ request }: { request: Request }) =>
  fetchPage(new URL(request.url).pathname);

export async function fetchErrors() {
  const cmsErrorSlug = "/error/";

  const errorPagePromises = httpErrorCodes.map((errorCode) =>
    fetchCollectionEntry("pages", [
      { field: "slug", value: `${cmsErrorSlug}${errorCode}` },
    ]),
  );

  const errorPageEntries = (await Promise.allSettled(errorPagePromises))
    .filter(
      (promise): promise is PromiseFulfilledResult<StrapiPage> =>
        promise.status === "fulfilled",
    )
    .map((errorPage) => [
      errorPage.value.slug.replace(cmsErrorSlug, ""),
      errorPage.value.content,
    ]) satisfies [string, StrapiPage["content"]][];

  return Object.fromEntries(errorPageEntries);
}
