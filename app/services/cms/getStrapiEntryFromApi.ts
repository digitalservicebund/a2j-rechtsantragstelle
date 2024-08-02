import type { AxiosResponse } from "axios";
import axios from "axios";
import type { Filter, GetStrapiEntryOpts } from "./filters";
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

type SingleStrapiEntry =
  | StrapiFileContent["vorab-check-pages"][0]
  | StrapiFileContent["form-flow-pages"][0]
  | StrapiFileContent["footer"][0]
  | StrapiFileContent["pages"][0]
  | StrapiFileContent["result-pages"][0]
  | undefined;

const unpackResponse = (response: AxiosResponse) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data } = response.data;
  // collection type results come as an array with one item
  return (Array.isArray(data) ? data[0] : data) as SingleStrapiEntry;
};

const makeStrapiRequest = async (url: string) =>
  axios.get(url, {
    validateStatus: (status) => status < 500,
    headers: {
      Authorization: "Bearer " + config().STRAPI_ACCESS_KEY,
    },
  });

export const getStrapiCollectionFromApi = async (opts: GetStrapiEntryOpts) =>
  ((await makeStrapiRequest(buildUrl(opts))).data as { data: object }).data;

export const getStrapiEntryFromApi = async (opts: GetStrapiEntryOpts) => {
  const stagingUrl = buildUrl({ ...opts, locale: stagingLocale });
  let response = unpackResponse(await makeStrapiRequest(stagingUrl));
  if (!response) {
    response = unpackResponse(await makeStrapiRequest(buildUrl(opts)));
  }
  return response?.attributes;
};
