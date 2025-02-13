import { faker } from "@faker-js/faker";
import { StrapiParagraph } from "~/services/cms/models/StrapiParagraph";

export function getStrapiParagraph(): StrapiParagraph {
  return {
    html: `<p>${faker.lorem.paragraph()}<p>`,
    id: -1,
    __component: "basic.paragraph",
  };
}
