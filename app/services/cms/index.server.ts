import { config } from "../env/env.server";
import type { StrapiLocale } from "./models/StrapiLocale";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import type { StrapiFileContent } from "./models/StrapiFileContent";
import { HasStrapiMetaSchema } from "./models/HasStrapiMeta";
import type { z } from "zod";
import type { CollectionSchemas, EntrySchemas } from "./schemas";
import { collectionSchemas, entrySchemas } from "./schemas";

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

export async function fetchCollectionEntry<
  ApiId extends keyof CollectionSchemas,
>(
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

export const strapiPageFromRequest = async ({
  request,
  locale,
}: {
  request: Request;
  locale?: StrapiLocale;
}) =>
  await fetchCollectionEntry("pages", new URL(request.url).pathname, locale);
