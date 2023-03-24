import type { CMS } from "..";
import { Locale } from "~/services/cms/models/Locale";
import type { Document, IClient } from "./client";
import StrapiClient, { RequestBuilder, Parameter } from "./client";
import type BaseDocument from "../models/BaseDocument";

export default class StrapiCMS implements CMS {
  client: IClient;

  constructor(client: IClient = new StrapiClient()) {
    this.client = client;
  }

  getMenu(id: string, locale?: Locale): Promise<BaseDocument[] | undefined> {
    if (locale === undefined) {
      locale = Locale.de;
    }

    return this.client
      .getDocument(
        "menus",
        new RequestBuilder()
          .setFilter({
            field: "slug",
            value: `${id}_${Locale[locale]}`,
          })
          .addParameter(Parameter.nested)
          .toRequest()
      )
      .then((document) =>
        document?.attributes.items.data.map(
          (item: Document) => item.attributes as BaseDocument
        )
      );
  }

  getPage(
    pageName: string,
    locale?: Locale
  ): Promise<BaseDocument | undefined> {
    if (locale === undefined) {
      locale = Locale.de;
    }

    return this.client
      .getDocument(pageName, new RequestBuilder().setLocale(locale).toRequest())
      .then((document) => document?.attributes as BaseDocument);
  }

  getPageBySlug(slug: string, locale?: Locale): Promise<any> {
    if (locale === undefined) {
      locale = Locale.de;
    }

    return this.client
      .getDocument(
        "pages",
        new RequestBuilder()
          .setLocale(locale)
          .addFilter({
            field: "slug",
            value: slug,
          })
          .toRequest()
      )
      .then((document) => {
        console.log(document);

        return document?.attributes;
      });
  }
}
