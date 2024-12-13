import axios from "axios";
import type { Filter, GetStrapiEntryOpts } from "./filters";
import type { GetStrapiEntry } from "./getStrapiEntry";
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

const buildUrlV5 = ({
  apiId,
  pageSize,
  filters,
  locale = defaultLocale,
  populate = "*",
}: GetStrapiEntryOpts) =>
  [
    config().STRAPI_API,
    apiId,
    `?populate=${populate}`,
    `&pLevel`, // https://github.com/NEDDL/strapi-v5-plugin-populate-deep
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
  const returnData = (await makeStrapiRequest<T>(buildUrl(opts))).data.data;
  return Array.isArray(returnData) ? returnData : [returnData];
};
