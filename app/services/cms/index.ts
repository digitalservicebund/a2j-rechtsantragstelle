import config from "../config";
import type { StrapiLocale } from "./models/StrapiLocale";
import { getEntryFromFile } from "./file";
import { getEntryFromStrapi } from "./strapi";
import { StrapiFooterSchema } from "./models/StrapiFooter";
import { StrapiNavigationSchema } from "./models/StrapiNavigation";
import { StrapiPageSchema } from "./models/StrapiPage";
import { StrapiResultPageSchema } from "./models/StrapiResultPage";
import { StrapiVorabCheckCommonsSchema } from "./models/StrapiVorabCheckCommons";
import { StrapiVorabCheckPageSchema } from "./models/StrapiVorabCheckPage";

export type GetEntryOpts = {
  apiId: string;
  slug?: string;
  locale: StrapiLocale;
};

const getEntryFromSource =
  config().CMS === "FILE" ? getEntryFromFile : getEntryFromStrapi;

const getEntry = async (
  opts: Pick<GetEntryOpts, "apiId" | "slug"> & {
    locale?: StrapiLocale;
  }
) => {
  const data = await getEntryFromSource({ locale: "de", ...opts });
  // "remove attributes key"
  return { id: data.id, ...data.attributes };
};

// single types getters

type SingleTypeGetterOpts = {
  locale?: StrapiLocale;
};

export const getFooter = async (opts?: SingleTypeGetterOpts) =>
  StrapiFooterSchema.parse(await getEntry({ apiId: "footer", ...opts }));

export const getNavigation = async (opts?: SingleTypeGetterOpts) =>
  StrapiNavigationSchema.parse(
    await getEntry({ apiId: "navigation", ...opts })
  );

export const getVorabCheckCommons = async (opts?: SingleTypeGetterOpts) =>
  StrapiVorabCheckCommonsSchema.parse(
    await getEntry({ apiId: "vorab-check-common", ...opts })
  );

// collection types getters

type CollectionTypeGetterOpts = {
  slug: string;
} & SingleTypeGetterOpts;

export const getResultPage = async (opts: CollectionTypeGetterOpts) =>
  StrapiResultPageSchema.parse(
    await getEntry({ apiId: "result-pages", ...opts })
  );

export const getPage = async (opts: CollectionTypeGetterOpts) =>
  StrapiPageSchema.parse(await getEntry({ apiId: "pages", ...opts }));

export const getVorabCheckPage = async (opts: CollectionTypeGetterOpts) =>
  StrapiVorabCheckPageSchema.parse(
    await getEntry({ apiId: "vorab-check-pages", ...opts })
  );
