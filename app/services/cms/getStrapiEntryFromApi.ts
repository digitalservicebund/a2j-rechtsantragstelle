import axios from "axios";
import type { Filter, GetStrapiEntryOpts } from "./filters";
import type { GetStrapiEntry } from "./getStrapiEntry";
import { defaultLocale, stagingLocale } from "./models/StrapiLocale";
import type { ApiId, StrapiSchemas } from "./schemas";
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
  populate = "deep,10",
}: GetStrapiEntryOpts) =>
  [
    config().STRAPI_API,
    apiId,
    `?populate=${populate}`,
    `&locale=${locale}`,
    pageSize ? `&pagination[pageSize]=${pageSize}` : "",
    buildFilters(filters),
  ].join("");

const makeStrapiRequest = async <T extends ApiId>(url: string) =>
  axios.get<{ data: StrapiSchemas[T] | null }>(url, {
    validateStatus: (status) => status < 500,
    headers: {
      Authorization: "Bearer " + config().STRAPI_ACCESS_KEY,
    },
  });

export const getStrapiEntryFromApi: GetStrapiEntry = async <T extends ApiId>(
  opts: GetStrapiEntryOpts,
) => {
  const stagingUrl = buildUrl({ ...opts, locale: stagingLocale });
  const stagingData =
    opts.locale !== "all"
      ? (await makeStrapiRequest<T>(stagingUrl)).data.data
      : null;

  const invalidStagingData =
    !stagingData || (Array.isArray(stagingData) && stagingData.length === 0);

  const returnData = invalidStagingData
    ? (await makeStrapiRequest<T>(buildUrl(opts))).data.data
    : stagingData;

  return Array.isArray(returnData) ? returnData : [returnData];
};
