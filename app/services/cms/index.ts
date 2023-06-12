import config from "../config";
import type { StrapiLocale } from "./models/StrapiLocale";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { StrapiFooterSchema } from "./models/StrapiFooter";
import { StrapiNavigationSchema } from "./models/StrapiNavigation";
import { StrapiPageSchema } from "./models/StrapiPage";
import { StrapiResultPageSchema } from "./models/StrapiResultPage";
import { StrapiVorabCheckCommonSchema } from "./models/StrapiVorabCheckCommon";
import { StrapiVorabCheckPageSchema } from "./models/StrapiVorabCheckPage";
import { StrapiAmtsgerichtCommonSchema } from "./models/StrapiAmtsgerichtCommon";

export type GetStrapiEntryOpts = {
  apiId: string;
  slug?: string;
  locale: StrapiLocale;
};

const getStrapiEntryFromSource =
  config().CMS === "FILE" ? getStrapiEntryFromFile : getStrapiEntryFromApi;

const getStrapiEntry = async (
  opts: Pick<GetStrapiEntryOpts, "apiId" | "slug"> & {
    locale?: StrapiLocale;
  }
) => {
  const data = await getStrapiEntryFromSource({ locale: "de", ...opts });
  // remove "attributes" key
  // { id: 12, attributes: { text: "…" } } => { id: 12, text: "…" }
  return { id: data.id, ...data.attributes };
};

// single types getters

type StrapiSingleTypeGetterOpts = {
  locale?: StrapiLocale;
};

export const getStrapiFooter = async (opts?: StrapiSingleTypeGetterOpts) =>
  StrapiFooterSchema.parse(await getStrapiEntry({ apiId: "footer", ...opts }));

export const getStrapiNavigation = async (opts?: StrapiSingleTypeGetterOpts) =>
  StrapiNavigationSchema.parse(
    await getStrapiEntry({ apiId: "navigation", ...opts })
  );

export const getStrapiVorabCheckCommon = async (
  opts?: StrapiSingleTypeGetterOpts
) =>
  StrapiVorabCheckCommonSchema.parse(
    await getStrapiEntry({ apiId: "vorab-check-common", ...opts })
  );

export const getStrapiAmtsgerichtCommon = async (
  opts?: StrapiSingleTypeGetterOpts
) =>
  StrapiAmtsgerichtCommonSchema.parse(
    await getStrapiEntry({ apiId: "amtsgericht-common", ...opts })
  );

// collection types getters

type StrapiCollectionTypeGetterOpts = {
  slug: string;
} & StrapiSingleTypeGetterOpts;

export const getStrapiResultPage = async (
  opts: StrapiCollectionTypeGetterOpts
) =>
  StrapiResultPageSchema.parse(
    await getStrapiEntry({ apiId: "result-pages", ...opts })
  );

export const getStrapiPage = async (opts: StrapiCollectionTypeGetterOpts) =>
  StrapiPageSchema.parse(await getStrapiEntry({ apiId: "pages", ...opts }));

export const getStrapiVorabCheckPage = async (
  opts: StrapiCollectionTypeGetterOpts
) =>
  StrapiVorabCheckPageSchema.parse(
    await getStrapiEntry({ apiId: "vorab-check-pages", ...opts })
  );
