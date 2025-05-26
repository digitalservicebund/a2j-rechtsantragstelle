import { decode } from "html-entities";
import type { FlowId } from "~/domains/flowIds";
import {
  defaultLocale,
  type StrapiLocale,
} from "~/services/cms/models/StrapiLocale";
import type {
  Locale,
  Translations,
} from "~/services/translations/getTranslationByKey";
import { translations } from "~/services/translations/translations";
import type { Filter } from "./filters";
import { getStrapiEntry } from "./getStrapiEntry";
import { HasStrapiMetaSchema } from "./models/HasStrapiMeta";
import { type StrapiPage } from "./models/StrapiPage";
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
    deep: false,
  });
  const parsedEntry = HasStrapiMetaSchema.safeParse(pageEntry[0]);
  return parsedEntry.success ? parsedEntry.data.pageMeta : null;
}

export async function fetchSingleEntry<T extends SingleEntryId>(
  apiId: T,
  locale?: StrapiLocale,
): Promise<StrapiSchemasOutput[T][number]> {
  const strapiEntry = await getStrapiEntry({ apiId, locale });
  return entrySchemas[apiId].parse(strapiEntry)[0];
}

async function fetchCollectionEntry<T extends CollectionId>(
  apiId: T,
  filters?: Filter[],
  locale?: StrapiLocale,
): Promise<StrapiSchemasOutput[T][number]> {
  const strapiEntry = await getStrapiEntry({ apiId, filters, locale });
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

export async function fetchEntries<T extends ApiId>(
  props: GetStrapiEntryOpts<T>,
) {
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
  locale: Locale = defaultLocale,
): Promise<Translations> => {
  if (!Object.hasOwn(translations, name)) {
    console.warn(`Translation ${name} not found`);
    return Promise.resolve({});
  }
  const scopedTranslations = Object.fromEntries(
    Object.entries(translations[name]).map(([key, value]) => {
      if (!Object.hasOwn(value, locale))
        throw new Error(
          `Translation ${name}.${key} not found for locale ${locale}`,
        );
      return [key, decode(value[locale])];
    }),
  );
  return Promise.resolve(scopedTranslations);
};

export function fetchMultipleTranslations(
  scopes: string[],
): Promise<Record<string, Translations>> {
  if (!scopes.some((scope) => Object.hasOwn(translations, scope))) {
    throw new Error(
      `No matching translation scopes found for ${scopes.join(", ")}`,
    );
  }
  return scopes
    .filter((scope) => Object.hasOwn(translations, scope))
    .reduce(async (prev, current) => {
      const currentTranslations = await fetchTranslations(current);
      return {
        ...(await prev),
        [current]: currentTranslations,
      };
    }, Promise.resolve({}));
}

export const fetchPage = (slug: string) =>
  fetchCollectionEntry("pages", [{ field: "slug", value: slug }]);

export const fetchFlowPage = <T extends FlowPageId>(
  collection: T,
  flowId: FlowId,
  stepId: string,
): Promise<StrapiSchemasOutput[T][number]> =>
  fetchCollectionEntry(collection, [
    { field: "stepId", value: stepId },
    { field: "flow_ids", nestedField: "flowId", value: flowId },
  ]);

export const strapiPageFromRequest = ({ request }: { request: Request }) =>
  fetchPage(new URL(request.url).pathname);

export async function fetchErrors() {
  const cmsErrorSlug = "/error/";

  const errorPages = await fetchEntries({
    apiId: "pages",
    locale: defaultLocale,
    filters: [
      {
        field: "slug",
        operation: "$in",
        value: [
          `${cmsErrorSlug}404`,
          `${cmsErrorSlug}500`,
          `${cmsErrorSlug}403`,
        ],
      },
    ],
  });

  const errorPageEntries = errorPages
    .filter((page) => page !== null)
    .map((errorPage) => [
      errorPage.slug.replace(cmsErrorSlug, ""),
      errorPage.content,
    ]) satisfies Array<[string, StrapiPage["content"]]>;

  return Object.fromEntries(errorPageEntries);
}
