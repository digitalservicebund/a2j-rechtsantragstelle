import type { GetStrapiEntryOpts } from ".";
import contentFile from "~/../content.json";
import { StrapiFileContentSchema } from "./models/StrapiFileContent";

export const getStrapiEntryFromFile = async (opts: GetStrapiEntryOpts) => {
  const content = StrapiFileContentSchema.parse(contentFile);
  const apiIdContent = content[opts.apiId as keyof typeof content];

  return [...apiIdContent].find((item) => {
    if ("locale" in item.attributes && item.attributes.locale !== opts.locale)
      return false;

    return !(
      opts.slug &&
      "slug" in item.attributes &&
      item.attributes.slug !== opts.slug
    );
  });
};
