import { faker } from "@faker-js/faker";

export function getStrapiParagraph() {
  return {
    __component: `basic.paragraph`,
    html: `<p>${faker.lorem.paragraph()}<p>`,
    id: 123,
  };
}
