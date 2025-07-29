import type { FlowId } from "~/domains/flowIds";
import {
  defaultLocale,
  type StrapiLocale,
} from "~/services/cms/models/StrapiLocale";
import type { Translations } from "~/services/translations/getTranslationByKey";
import type { Filter } from "./filters";
import { getStrapiEntry } from "./getStrapiEntry";
import { HasStrapiMetaSchema } from "./models/HasStrapiMeta";
import { collectionSchemas, entrySchemas, strapiSchemas } from "./schemas";
import type {
  CollectionId,
  FlowPageId,
  SingleEntryId,
  ApiId,
  StrapiSchemasOutput,
  GetStrapiEntryOpts,
} from "./schemas";

export async function fetchMeta(
  opts: Omit<GetStrapiEntryOpts<"pages">, "apiId" | "filter"> & {
    filterValue: string;
  },
) {
  const populate = "pageMeta";
  const filters = [{ value: opts.filterValue, field: "slug" }];
  const apiId = "pages";
  const pageEntry = await getStrapiEntry({
    ...opts,
    filters,
    apiId,
    populate,
  });
  const parsedEntry = HasStrapiMetaSchema.safeParse(pageEntry[0]);
  return parsedEntry.success ? parsedEntry.data.pageMeta : null;
}

export async function fetchSingleEntry<T extends SingleEntryId>(
  apiId: T,
  locale?: StrapiLocale,
  pLevel = 5,
): Promise<StrapiSchemasOutput[T][number]> {
  const strapiEntry = await getStrapiEntry({ apiId, locale, pLevel });
  return entrySchemas[apiId].parse(strapiEntry)[0];
}

async function fetchCollectionEntry<T extends CollectionId>(
  apiId: T,
  pLevel = 5,
  filters?: Filter[],
  locale?: StrapiLocale,
): Promise<StrapiSchemasOutput[T][number]> {
  const strapiEntry = await getStrapiEntry({ apiId, filters, locale, pLevel });
  const strapiEntryParsed = collectionSchemas[apiId].safeParse(strapiEntry);

  if (strapiEntryParsed?.data?.length === 0) {
    const error = new Error(
      `CMS lookup for ${apiId} failed (filters: ${JSON.stringify(filters)})`,
    );
    error.name = "StrapiPageNotFound";
    throw error;
  } else if (!strapiEntryParsed.success) {
    const error = new Error(
      `Unable to successfully parse schema: ${strapiEntryParsed.error.message}`,
    );
    throw error;
  }
  return strapiEntryParsed.data[0];
}

async function fetchEntries<T extends ApiId>(props: GetStrapiEntryOpts<T>) {
  const entries = await getStrapiEntry(props);
  const parsedEntries = strapiSchemas[props.apiId].safeParse(entries);
  if (parsedEntries.data?.length === 0) {
    throw new Error(
      `CMS lookup for pages failed (filters: ${JSON.stringify(props.filters)})`,
    );
  } else if (!parsedEntries.success) {
    const error = new Error(
      `Unable to successfully parse schema: ${parsedEntries.error.message}`,
    );
    throw error;
  }
  return parsedEntries.data as StrapiSchemasOutput[T];
}

export const fetchTranslations = async (
  name: string,
): Promise<Translations> => {
  const filters = [{ field: "scope", value: name }];
  try {
    return (
      await fetchCollectionEntry("translations", 2, filters, defaultLocale)
    ).entries;
  } catch {
    return {};
  }
};

export async function fetchMultipleTranslations(scopes: string[]) {
  const translations = await fetchEntries({
    apiId: "translations",
    locale: "de",
    filters: [{ field: "scope", operation: "$in", value: scopes }],
    pLevel: 2,
  });
  return Object.fromEntries(
    translations.map(({ scope, entries }) => [scope, entries]),
  );
}

export const fetchPage = (slug: string) =>
  fetchCollectionEntry("pages", 5, [{ field: "slug", value: slug }]);

export const fetchFlowPage = <T extends FlowPageId>(
  collection: T,
  flowId: FlowId,
  stepId: string,
): Promise<StrapiSchemasOutput[T][number]> =>
  fetchCollectionEntry(collection, 6, [
    { field: "stepId", value: stepId },
    { field: "flow_ids", nestedField: "flowId", value: flowId },
  ]);

export const strapiPageFromRequest = ({ request }: { request: Request }) =>
  fetchPage(new URL(request.url).pathname);
