import type { AxiosResponse } from "axios";
import axios from "axios";
import config from "~/services/config";
import type { GetStrapiEntryOpts } from ".";

const buildUrl = ({ apiId, slug, locale }: GetStrapiEntryOpts) =>
  [
    config().STRAPI_API,
    apiId,
    "?populate=deep",
    `&locale=${locale}`,
    slug ? `&filters[slug][$eq]=${slug}` : "",
  ].join("");

const unpackResponse = (response: AxiosResponse) => {
  let data = response.data.data;

  // collection type results come as an array with one item
  if (Array.isArray(data)) {
    data = data[0];
  }

  return data;
};

export const getStrapiEntryFromApi = async (opts: GetStrapiEntryOpts) => {
  const response = await axios.get(buildUrl(opts), {
    headers: {
      Authorization: "Bearer " + config().STRAPI_ACCESS_KEY,
    },
  });

  return unpackResponse(response);
};
