import type { CMS } from "..";
import { Locale } from "~/services/cms/models/Locale";
import type { Document, IClient } from "./client";
import StrapiClient, { RequestBuilder, Parameter } from "./client";
import type BaseDocument from "../models/BaseDocument";
import config from "~/services/config";

const localeDefault = Locale.de;
const collectionDefault = "pages";

const collectionMap = new Map([["vorabcheck", "vorab-check-pages"]]);

export default class StrapiCMS implements CMS {
  client: IClient;

  constructor(client: IClient = new StrapiClient()) {
    this.client = client;
  }

  async getMenu(
    id: string,
    locale?: Locale
  ): Promise<BaseDocument[] | undefined> {
    const request = new RequestBuilder()
      .setFilter({
        field: "slug",
        value: `${id}_${Locale[locale ?? localeDefault]}`,
      })
      .addParameter(Parameter.nested)
      .toRequest();

    const document = await this.client.getDocument("menus", request);
    return document?.attributes.items.data.map(
      (item: Document) => item.attributes as BaseDocument
    );
  }

  async getPage(pageName: string, locale?: Locale): Promise<any> {
    const request = new RequestBuilder()
      .setLocale(locale ?? localeDefault)
      .toRequest();
    const document = await this.client.getDocument(pageName, request);
    return document?.attributes;
  }

  async getPageFromCollection(
    collection: string,
    pageName: string,
    locale?: Locale
  ): Promise<any> {
    const strapiCollection = collectionMap.get(collection) ?? collectionDefault;

    const request = new RequestBuilder()
      .setLocale(locale ?? localeDefault)
      .addFilter({
        field: "slug",
        value: pageName,
      })
      .toRequest();

    const document = await this.client.getDocument(strapiCollection, request);
    return document?.attributes;
  }

  getImageLocation(imagePath: string): string {
    if (
      imagePath.indexOf("http://") === 0 ||
      imagePath.indexOf("https://") === 0
    ) {
      return imagePath;
    }

    return config().STRAPI_HOST + imagePath;
  }
}
