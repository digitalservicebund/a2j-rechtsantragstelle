import type { z } from "zod";
import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { HasStrapiMetaSchema } from "./models/HasStrapiMeta";
import type { StrapiFileContent } from "./models/StrapiFileContent";
import type { StrapiLocale } from "./models/StrapiLocale";
import type { StrapiPage } from "./models/StrapiPage";
import type { CollectionSchemas, EntrySchemas, FlowPage } from "./schemas";
import { collectionSchemas, entrySchemas } from "./schemas";
import { config } from "../env/env.server";
import { httpErrorCodes } from "../errorPages/ErrorBox";

export type GetStrapiEntryOpts = {
  apiId: keyof StrapiFileContent;
  filterField?: string;
  filterValue?: string;
  locale?: StrapiLocale;
  populate?: string;
  pageSize?: string;
};

export type Translations = Record<string, string>;

const getStrapiEntry =
  config().CMS === "FILE" ? getStrapiEntryFromFile : getStrapiEntryFromApi;

export async function fetchMeta(opts: Omit<GetStrapiEntryOpts, "apiId">) {
  const populate = "meta";
  const pageEntry = await getStrapiEntry({ ...opts, apiId: "pages", populate });
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
  filterValue: string,
  filterField = "slug",
  locale?: StrapiLocale,
): Promise<z.infer<CollectionSchemas[ApiId]>> {
  const strapiEntry = await getStrapiEntry({
    apiId,
    locale,
    filterValue,
    filterField,
  });

  if (!strapiEntry) {
    const error = new Error(
      `page missing in cms: ${filterField}:${filterValue}`,
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
  try {
    const entry = fetchCollectionEntry("translations", name, "scope", locale);
    return Object.fromEntries(
      (await entry).field.map(({ name, value }) => [name, value]),
    );
  } catch {
    return {};
  }
};

export const fetchPage = (slug: string) => fetchCollectionEntry("pages", slug);

export const fetchFlowPage = <ApiId extends FlowPage>(
  collection: ApiId,
  slug: string,
) => fetchCollectionEntry(collection, slug);

export const strapiPageFromRequest = ({
  request,
}: {
  request: Request;
  locale?: StrapiLocale;
}) => fetchPage(new URL(request.url).pathname);

export async function fetchErrors() {
  const cmsErrorSlug = "/error/";

  const errorPagePromises = httpErrorCodes.map((errorCode) =>
    fetchCollectionEntry("pages", `${cmsErrorSlug}${errorCode}`),
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
