import config from "../config";
import type { Locale } from "./models/Locale";
import { Locale as LocaleOption } from "~/services/cms/models/Locale";
import Strapi from "./strapi";

export const LOCALE_DEFAULT = LocaleOption.de;
export const COLLECTION_DEFAULT = "pages";
export const COLLECTION_MAP = new Map([
  ["vorabcheck", "vorab-check-pages"],
  ["resultPage", "result-pages"],
]);

export interface CMS {
  getPage(pageName: string, locale?: Locale): Promise<any>;
  getPageFromCollection(
    collection: string,
    pageName: string,
    locale?: Locale
  ): Promise<any>;
  getImageLocation(imagePath: string): string;
}

export default function getCMS(): CMS {
  switch (config().CMS) {
    // switch here in the future between STRAPI and FILE
    default:
      return new Strapi();
  }
}
