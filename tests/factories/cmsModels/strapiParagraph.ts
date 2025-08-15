import { faker } from "@faker-js/faker";
import { type StrapiParagraph } from "~/services/cms/models/content/StrapiParagraph";

export function getStrapiParagraph(): StrapiParagraph {
  return {
    text: faker.lorem.paragraph(),
    id: faker.number.int({ min: 0 }),
  };
}
