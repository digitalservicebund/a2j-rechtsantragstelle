import { faker } from "@faker-js/faker";

export function getStrapiParagraph() {
  return { text: `<p>${faker.lorem.paragraph()}<p>` };
}
