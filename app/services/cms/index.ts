import config from "../config";
import { getEntry as getEntryFromStrapi } from "./strapi";
import { getEntry as getEntryFromFile } from "./file";
import type { Locale } from "./models/Locale";
import { FooterSchema } from "./models/Footer";
import { NavigationSchema } from "./models/Navigation";
import { VorabcheckPageSchema } from "./models/VorabcheckPage";
import { VorabCheckCommonsSchema } from "./models/VorabCheckCommons";
import { PageSchema } from "./models/Page";
import { ResultPageSchema } from "./models/ResultPage";

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
  let data = await getEntryFromSource({ locale: "de", ...opts });

  // "flatten" the result object
  if (data?.attributes) {
    data = { id: data.id, ...data.attributes };
  }

  return data;
};

type SingleTypeGetterOpts = {
  locale?: Locale;
};

type CollectionTypeGetterOpts = {
  slug: string;
} & SingleTypeGetterOpts;

// single types getter
export const getFooter = async (opts?: SingleTypeGetterOpts) =>
  FooterSchema.parse(await getEntry({ apiId: "footer", ...opts }));

export const getNavigation = async (opts?: SingleTypeGetterOpts) =>
  NavigationSchema.parse(await getEntry({ apiId: "navigation", ...opts }));

export const getVorabCheckCommons = async (opts?: SingleTypeGetterOpts) =>
  VorabCheckCommonsSchema.parse(
    await getEntry({ apiId: "vorab-check-common", ...opts })
  );

// collection types getter
export const getResultPage = async (opts: CollectionTypeGetterOpts) =>
  ResultPageSchema.parse(await getEntry({ apiId: "result-pages", ...opts }));

export const getPage = async (opts: CollectionTypeGetterOpts) =>
  PageSchema.parse(await getEntry({ apiId: "pages", ...opts }));

export const getVorabCheckPage = async (opts: CollectionTypeGetterOpts) =>
  VorabcheckPageSchema.parse(
    await getEntry({ apiId: "vorab-check-pages", ...opts })
  );
