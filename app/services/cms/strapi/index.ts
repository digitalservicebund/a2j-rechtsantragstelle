import type { AxiosResponse } from "axios";
import axios from "axios";
import config from "~/services/config";
import type { GetEntryOpts } from "..";

const buildUrl = ({ apiId, slug, locale }: GetEntryOpts) =>
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

export const getEntryFromStrapi = async (opts: GetEntryOpts) => {
  const response = await axios.get(buildUrl(opts), {
    headers: {
      Authorization: "Bearer " + config().STRAPI_ACCESS_KEY,
    },
  });

  return unpackResponse(response);
};
