import { faker } from "@faker-js/faker";
import { StrapiFooter } from "~/services/cms/models/StrapiFooter";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { getStrapiImage } from "./strapiImage";
import { getStrapiLink } from "./strapiLink";
import { getStrapiParagraph } from "./strapiParagraph";

export function getStrapiFooter(): StrapiFooter {
  return {
    locale: defaultLocale,
    image: getStrapiImage(),
    paragraphs: faker.helpers.multiple(getStrapiParagraph, { count: 2 }),
    categorizedLinks: [
      {
        id: faker.number.int(),
        title: faker.word.sample(),
        links: faker.helpers.multiple(getStrapiLink),
      },
    ],
  };
}
