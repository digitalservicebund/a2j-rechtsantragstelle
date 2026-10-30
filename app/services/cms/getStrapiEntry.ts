import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { config } from "../env/env.server";
import { config as publicConfig } from "../env/public";
import {
  type ApiId,
  type GetStrapiEntry,
  type GetStrapiEntryOpts,
  type StrapiSchemas,
} from "./schemas";
import { defaultLocale } from "./models/StrapiLocale";

// Fetches every locale at once, so a single request can serve any locale filter below
async function getEntries<T extends ApiId>(
  opts: GetStrapiEntryOpts<T> & { apiId: T },
): Promise<StrapiSchemas[T] | [null]> {
  // In case the CMS is File or environment is production, get entries from the file
  return config().CMS === "FILE" || publicConfig().ENVIRONMENT === "production"
    ? await getStrapiEntryFromFile({ ...opts, locale: "*" })
    : await getStrapiEntryFromApi({
        ...opts,
        locale: undefined,
        showDraftVersion: true, // Always get the draft version when get the entries via Api and running the application
      });
}

export const getStrapiEntry: GetStrapiEntry = async <T extends ApiId>(
  opts: GetStrapiEntryOpts<T> & { apiId: T },
) => {
  const entries = await getEntries<T>(opts);

  // In case the locale has value on the opts, filter for the locale, otherwise for the defaultLocale
  const filterLocale = opts.locale ?? defaultLocale;
  const localeEntries = entries.filter(
    (entry) => entry && "locale" in entry && entry.locale === filterLocale,
  ) as StrapiSchemas[T];

  if (localeEntries.length === 0) {
    return entries;
  }

  // "translations" is a collection with one entry per scope, so keep every match;
  // other apiIds are single entries, so only the first match is relevant
  return opts.apiId === "translations"
    ? localeEntries
    : ([localeEntries[0]] as StrapiSchemas[T]);
};
