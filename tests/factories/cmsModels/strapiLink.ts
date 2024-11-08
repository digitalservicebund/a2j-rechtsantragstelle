import { faker } from "@faker-js/faker";
import type { StrapiLink } from "~/services/cms/models/StrapiLink";

export function getStrapiLink(): StrapiLink {
  return {
    url: faker.internet.url(),
    text: faker.lorem.words(),
  };
}
