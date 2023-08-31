import { config } from "../env/env.server";
import type { StrapiLocale } from "./models/StrapiLocale";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { StrapiFooterSchema } from "./models/StrapiFooter";
import { StrapiPageSchema } from "./models/StrapiPage";
import { StrapiResultPageSchema } from "./models/StrapiResultPage";
import { StrapiVorabCheckCommonSchema } from "./models/StrapiVorabCheckCommon";
import { StrapiVorabCheckPageSchema } from "./models/StrapiVorabCheckPage";
import { StrapiAmtsgerichtCommonSchema } from "./models/StrapiAmtsgerichtCommon";
import type { StrapiFileContent } from "./models/StrapiFileContent";
import { HasStrapiMetaSchema } from "./models/HasStrapiMeta";
import type { z } from "zod";
import { StrapiCookieBannerSchema } from "./models/StrapiCookieBannerSchema";
import { StrapiPageHeaderSchema } from "./models/StrapiPageHeader";
import { StrapiGlobalSchema } from "./models/StrapiGlobal";

export type GetStrapiEntryOpts = {
  apiId: keyof StrapiFileContent;
  slug?: string;
  locale?: StrapiLocale;
};

const getStrapiEntry =
  config().CMS === "FILE" ? getStrapiEntryFromFile : getStrapiEntryFromApi;

export async function fetchMeta(opts: Omit<GetStrapiEntryOpts, "apiId">) {
  const populate = "meta";
  const pageEntry = await getStrapiEntry({ ...opts, apiId: "pages", populate });
  return HasStrapiMetaSchema.parse(pageEntry).meta;
}

const entrySchemas = {
  "page-header": StrapiPageHeaderSchema,
  global: StrapiGlobalSchema,
  footer: StrapiFooterSchema,
  "vorab-check-common": StrapiVorabCheckCommonSchema,
  "amtsgericht-common": StrapiAmtsgerichtCommonSchema,
  "cookie-banner": StrapiCookieBannerSchema,
} as const;
type EntrySchemas = typeof entrySchemas;

export async function fetchSingleEntry<ApiId extends keyof EntrySchemas>(
  apiId: ApiId,
  locale?: StrapiLocale,
): Promise<z.infer<EntrySchemas[ApiId]>> {
  const strapiEntry = await getStrapiEntry({ apiId, locale });
  return entrySchemas[apiId].parse(strapiEntry);
}

const collectionSchemas = {
  pages: StrapiPageSchema,
  "result-pages": StrapiResultPageSchema,
  "vorab-check-pages": StrapiVorabCheckPageSchema,
} as const;
type CollectionSchemas = typeof collectionSchemas;

export async function fetchCollectionEntry<
  ApiId extends keyof CollectionSchemas,
>(
  apiId: ApiId,
  slug: string,
  locale?: StrapiLocale,
): Promise<z.infer<CollectionSchemas[ApiId]>> {
  const strapiEntry = await getStrapiEntry({ apiId, locale, slug });
  if (!strapiEntry) {
    const error = new Error(`page missing in cms: ${slug}`);
    error.name = "StrapiPageNotFound";
    throw error;
  }
  return collectionSchemas[apiId].parse(strapiEntry);
}

export const strapiPageFromRequest = async ({
  request,
  locale,
}: {
  request: Request;
  locale?: StrapiLocale;
}) =>
  await fetchCollectionEntry("pages", new URL(request.url).pathname, locale);
