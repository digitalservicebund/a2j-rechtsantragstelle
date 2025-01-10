import type { FlowId } from "~/domains/flowIds";
import {
  defaultLocale,
  type StrapiLocale,
} from "~/services/cms/models/StrapiLocale";
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
import type { Translations } from "../translations/getTranslationByKey";

export async function fetchMeta(
  opts: Omit<GetStrapiEntryOpts, "apiId" | "filter"> & { filterValue: string },
) {
  const populate = "pageMeta";
  const filters = [{ value: opts.filterValue, field: "slug" }];
  const apiId = "pages";
  const pageEntry = await getStrapiEntry({
    ...opts,
    filters,
    apiId,
    populate,
    deep: false,
  });
  const parsedEntry = HasStrapiMetaSchema.safeParse(pageEntry[0]);
  return parsedEntry.success ? parsedEntry.data.pageMeta : null;
}

export async function fetchSingleEntry<T extends SingleEntryId>(
  apiId: T,
  locale?: StrapiLocale,
): Promise<StrapiSchemas[T][number]> {
  const strapiEntry = await getStrapiEntry({ apiId, locale });
  return entrySchemas[apiId].parse(strapiEntry)[0];
}

async function fetchCollectionEntry<T extends CollectionId>(
  apiId: T,
  filters?: Filter[],
  locale?: StrapiLocale,
): Promise<StrapiSchemas[T][number]> {
  const strapiEntry = await getStrapiEntry({ apiId, filters, locale });
  const strapiEntryParsed = collectionSchemas[apiId].safeParse(strapiEntry);

  if (!strapiEntryParsed.success || strapiEntryParsed.data.length === 0) {
    const error = new Error(
      `CMS lookup for ${apiId} failed (filters: ${JSON.stringify(filters)})`,
    );
    error.name = "StrapiPageNotFound";
    throw error;
  }
  return strapiEntryParsed.data[0];
}

export const fetchTranslations = async (
  name: string,
): Promise<Translations> => {
  const filters = [{ field: "scope", value: name }];
  try {
    const entry = await fetchCollectionEntry(
      "translations",
      filters,
      defaultLocale,
    );
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
): Promise<StrapiSchemas[T][number]> =>
  fetchCollectionEntry(collection, [
    { field: "stepId", value: stepId },
    { field: "flow_ids", nestedField: "flowId", value: flowId },
  ]);

export const strapiPageFromRequest = ({ request }: { request: Request }) =>
  fetchPage(new URL(request.url).pathname);

export async function fetchErrors() {
  const cmsErrorSlug = "/error/";

  const errorPagePromises = httpErrorCodes.map((errorCode) =>
    fetchCollectionEntry(
      "pages",
      [{ field: "slug", value: `${cmsErrorSlug}${errorCode}` }],
      defaultLocale,
    ),
  );

  const errorPageEntries = (await Promise.allSettled(errorPagePromises))
    .filter(
      (promise): promise is PromiseFulfilledResult<StrapiPage> =>
        promise.status === "fulfilled",
    )
    .map((errorPage) => [
      errorPage.value.slug.replace(cmsErrorSlug, ""),
      errorPage.value.content,
    ]) satisfies Array<[string, StrapiPage["content"]]>;

  return Object.fromEntries(errorPageEntries);
}
