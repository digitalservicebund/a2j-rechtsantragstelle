import { faker } from "@faker-js/faker";
import { StrapiParagraph } from "~/services/cms/models/StrapiParagraph";

export function getStrapiParagraph(): StrapiParagraph {
  const fakeHtml = `<p>${faker.lorem.paragraph()}<p>`;
  return {
    __component: `basic.paragraph`,
    html: fakeHtml,
    text: fakeHtml,
    id: -1,
  };
}
