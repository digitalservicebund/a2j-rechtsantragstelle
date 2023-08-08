import type { AxiosResponse } from "axios";
import axios from "axios";
import { config } from "~/services/env/env.server";
import type { GetStrapiEntryOpts } from "./index.server";

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

const makeStrapiRequest = async (opts: GetStrapiEntryOpts) =>
  axios.get(buildUrl(opts), {
    validateStatus: (status) => status < 500,
    headers: {
      Authorization: "Bearer " + config().STRAPI_ACCESS_KEY,
    },
  });

export const getStrapiEntryFromApi = async (opts: GetStrapiEntryOpts) => {
  // locale "sg" means "staging"
  let response = await makeStrapiRequest({ ...opts, locale: "sg" });

  const unpacked = unpackResponse(response);
  if (!unpacked) {
    response = await makeStrapiRequest(opts);
  }

  return unpackResponse(response);
};
