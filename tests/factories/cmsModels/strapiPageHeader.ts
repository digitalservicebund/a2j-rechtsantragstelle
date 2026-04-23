import { faker } from "@faker-js/faker";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { type StrapiPageHeader } from "~/services/cms/models/StrapiPageHeader";

export function getStrapiPageHeader(): StrapiPageHeader {
  return {
    title: faker.word.words(2),
    linkLabel: faker.word.words(5),
    locale: defaultLocale,
  };
}
