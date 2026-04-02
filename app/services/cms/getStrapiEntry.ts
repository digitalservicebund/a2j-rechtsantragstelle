import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { config } from "../env/env.server";
import { config as publicConfig } from "../env/public";
import { defaultLocale, stagingLocale } from "./models/StrapiLocale";
import { type GetStrapiEntry } from "./schemas";

const getterFunction =
  config().CMS === "FILE" ? getStrapiEntryFromFile : getStrapiEntryFromApi;

export const getStrapiEntry: GetStrapiEntry = async (opts) => {
  if (opts.locale) return getterFunction(opts);

  if (publicConfig().ENVIRONMENT === "production")
    return getterFunction({ ...opts, locale: defaultLocale });

  // Fetch all locales at once, then try to return stagingLocale first.
  // Not really any but the filtering breaks type inference from getterFunction
  const entries = await getterFunction({ ...opts, locale: "*" });
  const stagingEntry: any = entries.find(
    (entry) => entry && "locale" in entry && entry.locale === stagingLocale,
  );
  return stagingEntry ? [stagingEntry] : entries;
};
