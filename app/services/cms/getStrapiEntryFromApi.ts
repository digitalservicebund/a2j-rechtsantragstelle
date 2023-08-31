import type { AxiosResponse } from "axios";
import axios from "axios";
import { config } from "../env/env.server";
import type { GetStrapiEntryOpts } from "./index.server";
import { defaultLocale, stagingLocale } from "./models/StrapiLocale";
import type { StrapiFileContent } from "./models/StrapiFileContent";

type UrlOptions = GetStrapiEntryOpts & { populate?: string };

const buildUrl = ({
  apiId,
  slug,
  locale = defaultLocale,
  populate = "deep",
}: UrlOptions) =>
  [
    config().STRAPI_API,
    apiId,
    `?populate=${populate}`,
    `&locale=${locale}`,
    slug ? `&filters[slug][$eq]=${slug}` : "",
  ].join("");

type SingleStrapiEntry =
  | StrapiFileContent["vorab-check-pages"][0]
  | StrapiFileContent["amtsgericht-common"][0]
  | StrapiFileContent["footer"][0]
  | StrapiFileContent["pages"][0]
  | StrapiFileContent["result-pages"][0]
  | StrapiFileContent["vorab-check-common"][0]
  | undefined;

const unpackResponse = (response: AxiosResponse) => {
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

export const getStrapiEntryFromApi = async (opts: UrlOptions) => {
  const stagingUrl = buildUrl({ ...opts, locale: stagingLocale });
  let response = unpackResponse(await makeStrapiRequest(stagingUrl));
  if (!response) {
    response = unpackResponse(await makeStrapiRequest(buildUrl(opts)));
  }
  return response?.attributes;
};
