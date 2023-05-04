import type { CMS } from "~/services/cms";
import type { Locale } from "~/services/cms/models/Locale";
import content from "./content.json";
import type { Page } from "~/services/cms/models/Page";
import { COLLECTION_DEFAULT, COLLECTION_MAP } from "~/services/cms";

export default class FileCMS implements CMS {
  // TODO make locale count
  getPage = (pageName: string, locale?: Locale) => {
    const typesContent = content as unknown as Record<
      string,
      { data: { attributes: Page } }
    >;
    return Promise.resolve(typesContent[pageName].data.attributes);
  };

  getPageFromCollection = (
    collection: string,
    pageName: string,
    locale?: Locale
  ) => {
    const typedContent = content as unknown as Record<
      string,
      { data: { attributes: Page }[] }
    >;
    return Promise.resolve(
      typedContent[
        COLLECTION_MAP.get(collection) ?? COLLECTION_DEFAULT
      ].data.find((page) => page.attributes.slug == pageName)?.attributes
    );
  };

  getImageLocation = (imagePath: string) => {
    // TODO add
    return "";
  };
}
