import { faker } from "@faker-js/faker";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { getStrapiImage } from "./strapiImage";
import { getStrapiLink } from "./strapiLink";
import { getStrapiParagraph } from "./strapiParagraph";

export function getStrapiFooter() {
  return {
    locale: defaultLocale,
    image: getStrapiImage(),
    paragraphs: Array.from(Array(2).keys()).map((_) => getStrapiParagraph()),
    links: Array.from(Array(7).keys()).map((_) => getStrapiLink()),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    publishedAt: faker.date.recent().toISOString(),
  };
}
