import type { CMS } from "..";
import { Locale } from "~/services/cms/models/Locale";
import type { Document, IClient } from "./client";
import StrapiClient, { RequestBuilder, Parameter } from "./client";
import type BaseDocument from "../models/BaseDocument";

const localeDefault = Locale.de;

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

  async getPage(
    pageName: string,
    locale?: Locale
  ): Promise<BaseDocument | undefined> {
    const request = new RequestBuilder()
      .setLocale(locale ?? localeDefault)
      .toRequest();
    const document = await this.client.getDocument(pageName, request);
    return document?.attributes as BaseDocument;
  }

  async getPageBySlug(slug: string, locale?: Locale): Promise<any> {
    const collection = slug.includes("vorabcheck/")
      ? "vorab-check-pages"
      : "pages";

    const request = new RequestBuilder()
      .setLocale(locale ?? localeDefault)
      .addFilter({
        field: "slug",
        value: slug,
      })
      .toRequest();

    const document = await this.client.getDocument(collection, request);
    return document?.attributes;
  }
}
