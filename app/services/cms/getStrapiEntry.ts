import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { config } from "../env/env.server";
import { defaultLocale, stagingLocale } from "./models/StrapiLocale";
import { type GetStrapiEntry } from "./schemas";

const getterFunction =
  config().CMS === "FILE" ? getStrapiEntryFromFile : getStrapiEntryFromApi;

export const getStrapiEntry: GetStrapiEntry = async (opts) => {
  if (opts.locale) return getterFunction(opts);

  if (config().ENVIRONMENT === "production")
    return getterFunction({ ...opts, locale: defaultLocale });

  const stagingData = await getterFunction({ ...opts, locale: stagingLocale });
  const returnData = stagingData.at(0)
    ? stagingData
    : await getterFunction({ ...opts, locale: defaultLocale });

  return returnData;
};
