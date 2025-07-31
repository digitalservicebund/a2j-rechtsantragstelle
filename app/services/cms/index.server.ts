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
  StrapiSchemasOutput,
  GetStrapiEntryOpts,
} from "./schemas";

const P_LEVEL_FLOW_PAGES = 6; // Flow pages require a deeper population level due the FieldSet component
const P_LEVEL_TRANSLATIONS = 2;
const P_LEVEL_DEFAULT = 5;

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
  pLevel = P_LEVEL_DEFAULT,
): Promise<StrapiSchemasOutput[T][number]> {
  const strapiEntry = await getStrapiEntry({ apiId, locale, pLevel });
  return entrySchemas[apiId].parse(strapiEntry)[0];
}

async function fetchCollectionEntry<T extends CollectionId>(
  apiId: T,
  pLevel = P_LEVEL_DEFAULT,
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

export const fetchTranslations = async (
  name: string,
): Promise<Translations> => {
  const filters = [{ field: "scope", value: name }];
  try {
    return (
      await fetchCollectionEntry(
        "translations",
        P_LEVEL_TRANSLATIONS,
        filters,
        defaultLocale,
      )
    ).entries;
  } catch {
    return {};
  }
};

export async function fetchMultipleTranslations(scopes: string[]) {
  const strapiEntry = await getStrapiEntry({
    apiId: "translations",
    filters: [{ field: "scope", operation: "$in", value: scopes }],
    locale: "de",
    pLevel: P_LEVEL_TRANSLATIONS,
  });
  const translationsParsed = strapiSchemas.translations.safeParse(strapiEntry);

  if (translationsParsed?.data?.length === 0) {
    const error = new Error(
      `CMS lookup for translations failed (filters: ${JSON.stringify(scopes)})`,
    );
    error.name = "StrapiPageNotFound";
    throw error;
  } else if (!translationsParsed.success) {
    const error = new Error(
      `Unable to successfully parse schema: ${translationsParsed.error.message}`,
    );
    throw error;
  }

  return Object.fromEntries(
    translationsParsed.data.map(({ scope, entries }) => [scope, entries]),
  );
}

export const fetchPage = (slug: string) =>
  fetchCollectionEntry("pages", P_LEVEL_DEFAULT, [
    { field: "slug", value: slug },
  ]);

export const fetchFlowPage = <T extends FlowPageId>(
  collection: T,
  flowId: FlowId,
  stepId: string,
): Promise<StrapiSchemasOutput[T][number]> =>
  fetchCollectionEntry(collection, P_LEVEL_FLOW_PAGES, [
    { field: "stepId", value: stepId },
    { field: "flow_ids", nestedField: "flowId", value: flowId },
  ]);

export const strapiPageFromRequest = ({ request }: { request: Request }) =>
  fetchPage(new URL(request.url).pathname);
