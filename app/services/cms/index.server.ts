import { z } from "zod";
import type { FlowId } from "~/domains/flowIds";
import {
  defaultLocale,
  type StrapiLocale,
} from "~/services/cms/models/StrapiLocale";
import type { Translations } from "~/services/translations/getTranslationByKey";
import type { Filter } from "./filters";
import { getStrapiEntry } from "./getStrapiEntry";
import { StrapiPageSchema } from "./models/StrapiPage";
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
const StrapiPageMetaSchema = StrapiPageSchema.pick({ pageMeta: true });
const StrapiNavigationEntrySchema = z.array(
  StrapiPageSchema.pick({ slug: true, pageMeta: true }),
);
const NAVIGATION_PAGE_SIZE = "100";

export async function fetchContentPageMeta(
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
  const parsedEntry = await StrapiPageMetaSchema.safeParseAsync(pageEntry[0]);
  return parsedEntry.success ? parsedEntry.data.pageMeta : null;
}

export async function fetchSingleEntry<T extends SingleEntryId>(
  apiId: T,
  locale?: StrapiLocale,
  pLevel = P_LEVEL_DEFAULT,
): Promise<StrapiSchemasOutput[T][number]> {
  const strapiEntry = await getStrapiEntry({ apiId, locale, pLevel });
  return (await entrySchemas[apiId].parseAsync(strapiEntry))[0];
}

async function fetchCollectionEntry<T extends CollectionId>(
  apiId: T,
  pLevel = P_LEVEL_DEFAULT,
  filters?: Filter[],
  locale?: StrapiLocale,
  status?: "draft" | "published",
): Promise<StrapiSchemasOutput[T][number]> {
  const strapiEntry = await getStrapiEntry({
    apiId,
    filters,
    locale,
    pLevel,
    status,
  });
  const strapiEntryParsed =
    await collectionSchemas[apiId].safeParseAsync(strapiEntry);

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
    return {};
  }

  if (!translationsParsed.success) {
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

// Locale is passed explicitly so the staging-locale fallback in getStrapiEntry doesn't apply
export const fetchJustizPage = (
  slug: string,
  status: "draft" | "published",
  locale: StrapiLocale = defaultLocale,
) =>
  fetchCollectionEntry(
    "justiz-de-pages",
    P_LEVEL_DEFAULT,
    [{ field: "slug", value: slug }],
    locale,
    status,
  );

export type JustizNavigationItem = { slug: string; title: string };

// One menu level: every page whose slug has a single segment, e.g. /onlinedienste
export async function fetchJustizNavigation(
  status: "draft" | "published",
  locale: StrapiLocale = defaultLocale,
): Promise<JustizNavigationItem[]> {
  const entries = await getStrapiEntry({
    apiId: "justiz-de-pages",
    locale,
    status,
    fields: "slug",
    populate: "pageMeta",
    pageSize: NAVIGATION_PAGE_SIZE,
  });

  const parsed = await StrapiNavigationEntrySchema.safeParseAsync(entries);
  if (!parsed.success) return [];

  return parsed.data
    .filter(({ slug }) => slug.split("/").filter(Boolean).length === 1)
    .map(({ slug, pageMeta }) => ({ slug, title: pageMeta.title }))
    .sort((a, b) => a.title.localeCompare(b.title, "de"));
}

export const fetchFlowPage = <T extends FlowPageId>(
  collection: T,
  flowId: FlowId,
  stepId: string,
): Promise<StrapiSchemasOutput[T][number]> =>
  fetchCollectionEntry(collection, P_LEVEL_FLOW_PAGES, [
    { field: "stepId", value: stepId },
    { field: "flow_ids", nestedField: "flowId", value: flowId },
  ]);
