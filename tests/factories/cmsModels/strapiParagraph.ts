import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { StrapiParagraph } from "~/services/cms/models/StrapiParagraph";

export const strapiParagraphFactory = Factory.define<StrapiParagraph>(() => {
  return { text: faker.lorem.paragraph() };
});
