import type { z } from "zod";
import type { FlowId } from "~/flows/flowIds";
import type { Filter, GetStrapiEntryOpts } from "./filters";
import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { HasStrapiMetaSchema } from "./models/HasStrapiMeta";
import type { StrapiLocale } from "./models/StrapiLocale";
import type { StrapiPage } from "./models/StrapiPage";
import type { CollectionSchemas, EntrySchemas, FlowPage } from "./schemas";
import { collectionSchemas, entrySchemas } from "./schemas";
import { config } from "../env/env.server";
import { httpErrorCodes } from "../errorPages/ErrorBox";

export type Translations = Record<string, string>;

const getStrapiEntry =
  config().CMS === "FILE" ? getStrapiEntryFromFile : getStrapiEntryFromApi;

export async function fetchMeta(
  opts: Omit<GetStrapiEntryOpts, "apiId" | "filter"> & { filterValue: string },
) {
  const populate = "meta";
  const filters = [{ value: opts.filterValue, field: "slug" }];
  const apiId = "pages";
  const pageEntry = await getStrapiEntry({ ...opts, filters, apiId, populate });
  const parsedEntry = HasStrapiMetaSchema.safeParse(pageEntry);
  return parsedEntry.success ? parsedEntry.data.meta : null;
}

export async function fetchSingleEntry<ApiId extends keyof EntrySchemas>(
  apiId: ApiId,
  locale?: StrapiLocale,
): Promise<z.infer<EntrySchemas[ApiId]>> {
  const strapiEntry = await getStrapiEntry({ apiId, locale });
  return entrySchemas[apiId].parse(strapiEntry);
}

async function fetchCollectionEntry<ApiId extends keyof CollectionSchemas>(
  apiId: ApiId,
  filters?: Filter[],
  locale?: StrapiLocale,
): Promise<z.infer<CollectionSchemas[ApiId]>> {
  const strapiEntry = await getStrapiEntry({
    apiId,
    locale,
    filters,
  });

  if (!strapiEntry) {
    const error = new Error(
      `CMS lookup for ${apiId} failed (filters: ${JSON.stringify(filters)})`,
    );
    error.name = "StrapiPageNotFound";
    throw error;
  }
  return collectionSchemas[apiId].parse(strapiEntry);
}

export const fetchTranslations = async (
  name: string,
  locale?: StrapiLocale,
): Promise<Translations> => {
  const filters = [{ field: "scope", value: name }];
  try {
    const entry = fetchCollectionEntry("translations", filters, locale);
    return Object.fromEntries(
      (await entry).field.map(({ name, value }) => [name, value]),
    );
  } catch {
    return {};
  }
};

export const fetchPage = (slug: string) =>
  fetchCollectionEntry("pages", [{ field: "slug", value: slug }]);

export const fetchFlowPage = <Collection extends keyof FlowPage>(
  collection: Collection,
  flowId: FlowId,
  stepId: string,
): Promise<z.infer<FlowPage[Collection]>> =>
  fetchCollectionEntry(collection, [
    { field: "stepId", value: "/" + stepId }, // TODO: align stepid between app & cms
    { field: "flow_ids", nestedField: "flowId", value: flowId },
  ]);

export const strapiPageFromRequest = ({
  request,
}: {
  request: Request;
  locale?: StrapiLocale;
}) => fetchPage(new URL(request.url).pathname);

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
