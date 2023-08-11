import { config } from "~/services/env/env.server";
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

export type GetStrapiEntryOpts = {
  apiId: keyof StrapiFileContent;
  slug?: string;
  locale?: StrapiLocale;
};

const getStrapiEntry =
  config().CMS === "FILE" ? getStrapiEntryFromFile : getStrapiEntryFromApi;

// single types getters

type StrapiSingleTypeGetterOpts = {
  locale?: StrapiLocale;
};

export const getStrapiFooter = async (opts?: StrapiSingleTypeGetterOpts) =>
  StrapiFooterSchema.parse(await getStrapiEntry({ apiId: "footer", ...opts }));

export const getStrapiVorabCheckCommon = async (
  opts?: StrapiSingleTypeGetterOpts,
) =>
  StrapiVorabCheckCommonSchema.parse(
    await getStrapiEntry({ apiId: "vorab-check-common", ...opts }),
  );

export const getStrapiAmtsgerichtCommon = async (
  opts?: StrapiSingleTypeGetterOpts,
) =>
  StrapiAmtsgerichtCommonSchema.parse(
    await getStrapiEntry({ apiId: "amtsgericht-common", ...opts }),
  );

// collection types getters

type StrapiCollectionTypeGetterOpts = {
  slug: string;
} & StrapiSingleTypeGetterOpts;

export const getStrapiResultPage = async (
  opts: StrapiCollectionTypeGetterOpts,
) =>
  StrapiResultPageSchema.parse(
    await getStrapiEntry({ apiId: "result-pages", ...opts }),
  );

export const getStrapiPage = async (opts: StrapiCollectionTypeGetterOpts) => {
  const entry = await getStrapiEntry({ apiId: "pages", ...opts });
  if (!entry) {
    const error = new Error(`page missing in cms: ${opts.slug}`);
    error.name = "StrapiPageNotFound";
    throw error;
  }
  return StrapiPageSchema.parse(entry);
};

export const getStrapiVorabCheckPage = async (
  opts: StrapiCollectionTypeGetterOpts,
) =>
  StrapiVorabCheckPageSchema.parse(
    await getStrapiEntry({ apiId: "vorab-check-pages", ...opts }),
  );

export const strapiPageFromRequest = async ({
  request,
  locale,
}: {
  request: Request;
  locale?: StrapiLocale;
}) => await getStrapiPage({ slug: new URL(request.url).pathname, locale });
