import config from "../config";
import type { Locale } from "./models/Locale";
import { getEntryFromFile } from "./file";
import { getEntryFromStrapi } from "./strapi";
import { FooterSchema } from "./models/Footer";
import { NavigationSchema } from "./models/Navigation";
import { PageSchema } from "./models/Page";
import { ResultPageSchema } from "./models/ResultPage";
import { VorabCheckCommonsSchema } from "./models/VorabCheckCommons";
import { VorabcheckPageSchema } from "./models/VorabcheckPage";

export type GetEntryOpts = {
  apiId: string;
  slug?: string;
  locale: Locale;
};

const getEntryFromSource =
  config().CMS === "FILE" ? getEntryFromFile : getEntryFromStrapi;

const getEntry = async (
  opts: Pick<GetEntryOpts, "apiId" | "slug"> & {
    locale?: Locale;
  }
) => {
  const data = await getEntryFromSource({ locale: "de", ...opts });
  // "remove attributes key"
  return { id: data.id, ...data.attributes };
};

// single types getters

type SingleTypeGetterOpts = {
  locale?: Locale;
};

export const getFooter = async (opts?: SingleTypeGetterOpts) =>
  FooterSchema.parse(await getEntry({ apiId: "footer", ...opts }));

export const getNavigation = async (opts?: SingleTypeGetterOpts) =>
  NavigationSchema.parse(await getEntry({ apiId: "navigation", ...opts }));

export const getVorabCheckCommons = async (opts?: SingleTypeGetterOpts) =>
  VorabCheckCommonsSchema.parse(
    await getEntry({ apiId: "vorab-check-common", ...opts })
  );

// collection types getters

type CollectionTypeGetterOpts = {
  slug: string;
} & SingleTypeGetterOpts;

export const getResultPage = async (opts: CollectionTypeGetterOpts) =>
  ResultPageSchema.parse(await getEntry({ apiId: "result-pages", ...opts }));

export const getPage = async (opts: CollectionTypeGetterOpts) =>
  PageSchema.parse(await getEntry({ apiId: "pages", ...opts }));

export const getVorabCheckPage = async (opts: CollectionTypeGetterOpts) =>
  VorabcheckPageSchema.parse(
    await getEntry({ apiId: "vorab-check-pages", ...opts })
  );
