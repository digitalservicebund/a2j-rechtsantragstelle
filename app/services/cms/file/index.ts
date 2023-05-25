import type { CMS } from "~/services/cms";
import type { Locale } from "~/services/cms/models/Locale";
import { COLLECTION_DEFAULT, COLLECTION_MAP } from "~/services/cms";
import {
  getContentFilePath,
  loadContentFile,
} from "~/services/cms/file/client";
import invariant from "tiny-invariant";
import type { FileContent } from "../models/FileContent";

const CONTENT_FILE_PATH = "content.json";

export default class FileCMS implements CMS {
  // TODO make locale count
  getPage = (pageName: string, locale?: Locale) => {
    const pageContent = loadContentFile(getContentFilePath(CONTENT_FILE_PATH))[
      pageName as keyof FileContent
    ];
    invariant(
      !pageContent || "attributes" in pageContent,
      "File Format: For single pages, attributes should be included in the data"
    );
    return Promise.resolve(pageContent?.attributes);
  };

  getPageFromCollection = (
    collection: string,
    pageName: string,
    locale?: Locale
  ) => {
    const collectionContent = loadContentFile(
      getContentFilePath(CONTENT_FILE_PATH)
    )[
      (COLLECTION_MAP.get(collection) ??
        COLLECTION_DEFAULT) as keyof FileContent
    ];
    invariant(
      !collectionContent || Array.isArray(collectionContent),
      "File Format: For collection pages, pages should be an array"
    );
    return Promise.resolve(
      [...collectionContent].find(
        (page) => "slug" in page.attributes && page.attributes.slug == pageName
      )?.attributes
    );
  };
}
