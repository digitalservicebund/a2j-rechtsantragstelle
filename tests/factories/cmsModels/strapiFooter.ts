import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { StrapiFooter } from "~/services/cms/models/StrapiFooter";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { strapiImageFactory } from "./strapiImage";
import { strapiLinkFactory } from "./strapiLink";
import { strapiParagraphFactory } from "./strapiParagraph";

export const strapiFooterFactory = Factory.define<StrapiFooter>(() => {
  return {
    locale: defaultLocale,
    image: strapiImageFactory.build(),
    paragraphs: strapiParagraphFactory.buildList(2),
    links: strapiLinkFactory.buildList(7),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    publishedAt: faker.date.recent().toISOString(),
  };
});
