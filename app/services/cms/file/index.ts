import type { GetEntryOpts } from "..";
import contentFile from "~/../content.json";
import { StrapiFileContentSchema } from "../models/StrapiFileContent";

export const getEntryFromFile = async (opts: GetEntryOpts) => {
  const content = StrapiFileContentSchema.parse(contentFile);
  const apiIdContent = content[opts.apiId as keyof typeof content];

  return [...apiIdContent].find((item) => {
    if ("locale" in item.attributes && item.attributes.locale !== opts.locale)
      return false;
    if (
      opts.slug &&
      "slug" in item.attributes &&
      item.attributes.slug !== opts.slug
    )
      return false;
    return true;
  });
};
