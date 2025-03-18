import { faker } from "@faker-js/faker";
import { StrapiParagraph } from "~/services/cms/models/StrapiParagraph";

export function getStrapiParagraph(): StrapiParagraph {
  return {
    text: faker.lorem.paragraph(),
    id: -1,
  };
}
