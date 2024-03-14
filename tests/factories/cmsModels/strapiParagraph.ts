import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { StrapiParagraph } from "~/services/cms/models/StrapiParagraph";

export const strapiParagraphFactory = Factory.define<StrapiParagraph>(() => {
  return { text: faker.lorem.paragraph() };
});
