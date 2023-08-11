import type { AxiosResponse } from "axios";
import axios from "axios";
import { config } from "~/services/env/env.server";
import type { GetStrapiEntryOpts } from "./index.server";
import { stagingLocale } from "./models/StrapiLocale";

const buildUrl = ({ apiId, slug, locale }: GetStrapiEntryOpts) =>
  [
    config().STRAPI_API,
    apiId,
    "?populate=deep",
    `&locale=${locale}`,
    slug ? `&filters[slug][$eq]=${slug}` : "",
  ].join("");

const unpackResponse = (response: AxiosResponse) => {
  const { data } = response.data;
  // collection type results come as an array with one item
  return Array.isArray(data) ? data[0] : data;
};

const makeStrapiRequest = async (url: string) =>
  axios.get(url, {
    validateStatus: (status) => status < 500,
    headers: {
      Authorization: "Bearer " + config().STRAPI_ACCESS_KEY,
    },
  });

export const getStrapiEntryFromApi = async (opts: GetStrapiEntryOpts) => {
  const stagingUrl = buildUrl({ ...opts, locale: stagingLocale });
  let response = unpackResponse(await makeStrapiRequest(stagingUrl));
  if (!response) {
    response = unpackResponse(await makeStrapiRequest(buildUrl(opts)));
  }
  return response;
};
