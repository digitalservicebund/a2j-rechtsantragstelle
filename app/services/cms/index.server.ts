import type { FlowId } from "~/domains/flowIds";
import type { StrapiLocale } from "~/services/cms/models/StrapiLocale";
import type { Translations } from "~/services/translations/getTranslationByKey";
import type { Filter, GetStrapiEntryOpts } from "./filters";
import { getStrapiEntry } from "./getStrapiEntry";
import { HasStrapiMetaSchema } from "./models/HasStrapiMeta";
import { type StrapiPage } from "./models/StrapiPage";
import { collectionSchemas, entrySchemas, strapiSchemas } from "./schemas";
import type {
  CollectionId,
  FlowPageId,
  SingleEntryId,
  StrapiSchemas,
  ApiId,
} from "./schemas";

export async function fetchMeta(
  opts: Omit<GetStrapiEntryOpts<"pages">, "apiId" | "filter"> & {
    filterValue: string;
  },
) {
  const populate = "meta";
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
  return parsedEntry.success ? parsedEntry.data.meta : null;
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

async function fetchEntries<T extends ApiId>(props: GetStrapiEntryOpts<T>) {
  const entries = await getStrapiEntry(props);
  const parsedEntries = strapiSchemas[props.apiId].safeParse(entries);
  if (!parsedEntries.success) {
    throw new Error(
      `CMS lookup for pages failed (filters: ${JSON.stringify(props.filters)})`,
    );
  }
  return parsedEntries.data as StrapiSchemas[T];
}

export const fetchTranslations = async (
  name: string,
): Promise<Translations> => {
  const filters = [{ field: "scope", value: name }];
  try {
    const entry = await fetchCollectionEntry("translations", filters, "de");
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

  const errorPages = await fetchEntries({
    apiId: "pages",
    locale: "de",
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
    ]) satisfies [string, StrapiPage["content"]][];

  return Object.fromEntries(errorPageEntries);
}
