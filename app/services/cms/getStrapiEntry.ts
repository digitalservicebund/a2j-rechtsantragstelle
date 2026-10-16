import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { config } from "../env/env.server";
import { config as publicConfig } from "../env/public";
import {
  type ApiId,
  type GetStrapiEntry,
  type GetStrapiEntryOpts,
} from "./schemas";
import { defaultLocale } from "./models/StrapiLocale";

// We fetch all the locales at once
async function getEntries<T extends ApiId>(
  opts: GetStrapiEntryOpts<T> & { apiId: T },
) {
  // In case the CMS is File or environment is production, get entries from the file
  return config().CMS === "FILE" || publicConfig().ENVIRONMENT === "production"
    ? await getStrapiEntryFromFile({ ...opts, locale: "*" })
    : await getStrapiEntryFromApi({
        ...opts,
        showDraftVersion: true, // Always get the draft version when get the entries via Api and running the application
      });
}

export const getStrapiEntry: GetStrapiEntry = async <T extends ApiId>(
  opts: GetStrapiEntryOpts<T> & { apiId: T },
) => {
  const entries = await getEntries<T>(opts);

  // In case the locale has value on the opts, filter for the locale, otherwise for the defaultLocale
  const filterLocale = opts.locale ?? defaultLocale;
  const localeEntry: any = entries.find(
    (entry) => entry && "locale" in entry && entry.locale === filterLocale,
  );

  return localeEntry ? [localeEntry] : entries;
};
