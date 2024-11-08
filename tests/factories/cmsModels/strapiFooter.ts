import { faker } from "@faker-js/faker";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { getStrapiImage } from "./strapiImage";
import { getStrapiLink } from "./strapiLink";
import { getStrapiParagraph } from "./strapiParagraph";

export function getStrapiFooter() {
  return {
    locale: defaultLocale,
    image: getStrapiImage(),
    paragraphs: faker.helpers.multiple(getStrapiParagraph, { count: 2 }),
    links: faker.helpers.multiple(getStrapiLink, { count: 7 }),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    publishedAt: faker.date.recent().toISOString(),
  };
}
