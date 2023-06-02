import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { StrapiFooter } from "~/services/cms/models/StrapiFooter";
import { strapiImageFactory } from "./strapiImage";
import { strapiLinkFactory } from "./strapiLink";
import { strapiParagraphFactory } from "./strapiParagraph";

export const strapiFooterFactory = Factory.define<StrapiFooter>(() => {
  return {
    locale: "de",
    image: strapiImageFactory.build(),
    paragraphs: strapiParagraphFactory.buildList(2, { __component: undefined }),
    links: strapiLinkFactory.buildList(7),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    publishedAt: faker.date.recent().toISOString(),
  };
});
