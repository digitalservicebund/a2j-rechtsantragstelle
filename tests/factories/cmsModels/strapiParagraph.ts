import { faker } from "@faker-js/faker";

export function getStrapiParagraph() {
  return { text: faker.lorem.paragraph() };
}
