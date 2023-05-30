import type { CMS } from "..";
import { Locale } from "~/services/cms/models/Locale";
import type { Document, IClient } from "./client";
import StrapiClient, { RequestBuilder, Parameter } from "./client";
import type BaseDocument from "../models/BaseDocument";
import { COLLECTION_DEFAULT, COLLECTION_MAP, LOCALE_DEFAULT } from "..";

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
        value: `${id}_${Locale[locale ?? LOCALE_DEFAULT]}`,
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
      .setLocale(locale ?? LOCALE_DEFAULT)
      .toRequest();
    try {
      const document = await this.client.getDocument(pageName, request);
      return document?.attributes;
    } catch (error) {
      console.error(error);
    }
  }

  async getPageFromCollection(
    collection: string,
    pageName: string,
    locale?: Locale
  ): Promise<any> {
    const strapiCollection =
      COLLECTION_MAP.get(collection) ?? COLLECTION_DEFAULT;

    const request = new RequestBuilder()
      .setLocale(locale ?? LOCALE_DEFAULT)
      .addFilter({
        field: "slug",
        value: pageName,
      })
      .toRequest();

    const document = await this.client.getDocument(strapiCollection, request);
    return document?.attributes;
  }
}
