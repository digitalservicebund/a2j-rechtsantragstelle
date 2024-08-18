import axios from "axios";
import type { Filter, GetStrapiEntryOpts } from "./filters";
import { GetStrapiEntry } from "./getStrapiEntry";
import type { StrapiFileContent } from "./models/StrapiFileContent";
import { defaultLocale, stagingLocale } from "./models/StrapiLocale";
import { config } from "../env/env.server";

function buildFilters(filters?: Filter[]) {
  if (!filters) return "";
  return filters
    .map(
      ({ field, nestedField, value }) =>
        `&filters[${field}]` +
        (nestedField ? `[${nestedField}]` : ``) +
        `[$eq]=${value}`,
    )
    .join("");
}

const buildUrl = ({
  apiId,
  pageSize,
  filters,
  locale = defaultLocale,
  populate = "deep",
}: GetStrapiEntryOpts) =>
  [
    config().STRAPI_API,
    apiId,
    `?populate=${populate}`,
    `&locale=${locale}`,
    pageSize ? `&pagination[pageSize]=${pageSize}` : "",
    buildFilters(filters),
  ].join("");

const makeStrapiRequest = async <T extends keyof StrapiFileContent>(
  url: string,
) =>
  axios.get<{ data: StrapiFileContent[T] }>(url, {
    validateStatus: (status) => status < 500,
    headers: {
      Authorization: "Bearer " + config().STRAPI_ACCESS_KEY,
    },
  });

export const getStrapiCollectionFromApi = async (opts: GetStrapiEntryOpts) =>
  ((await makeStrapiRequest(buildUrl(opts))).data as { data: object }).data;

export const getStrapiEntryFromApi: GetStrapiEntry = async <
  T extends keyof StrapiFileContent,
>(
  opts: GetStrapiEntryOpts,
) => {
  const stagingUrl = buildUrl({ ...opts, locale: stagingLocale });
  const stagingResponse = await makeStrapiRequest<T>(stagingUrl);
  if (stagingResponse.data.data?.length > 0) return stagingResponse.data.data;

  return (await makeStrapiRequest<T>(buildUrl(opts))).data.data;
};
