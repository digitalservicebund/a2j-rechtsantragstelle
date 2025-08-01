import axios from "axios";
import type { Filter } from "./filters";
import type {
  ApiId,
  StrapiSchemas,
  GetStrapiEntry,
  GetStrapiEntryOpts,
} from "./schemas";
import { config } from "../env/env.server";

function buildFilters(filters?: Filter[]) {
  if (!filters) return "";
  return filters
    .map(({ field, nestedField, operation, value }) => {
      if (operation === "$in" && Array.isArray(value)) {
        return value
          .map((v, idx) => `&filters[${field}][${operation}][${idx}]=${v}`)
          .join("");
      }
      return (
        `&filters[${field}]` +
        (nestedField ? `[${nestedField}]` : ``) +
        `[${operation ?? "$eq"}]=${typeof value === "string" ? value : ""}`
      );
    })
    .join("");
}

const buildUrl = <T extends ApiId>({
  apiId,
  pageSize,
  filters,
  locale,
  fields,
  populate = "*",
  pLevel,
}: GetStrapiEntryOpts<T>) =>
  [
    config().STRAPI_API,
    apiId,
    `?populate=${populate}`,
    fields ? `&fields=${fields}` : "",
    pLevel ? `&pLevel=${pLevel}` : "",
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
  opts: GetStrapiEntryOpts<T>,
) => {
  const returnData = (await makeStrapiRequest<T>(buildUrl(opts))).data.data;
  return Array.isArray(returnData) ? returnData : [returnData];
};
