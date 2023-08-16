import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { StrapiLink } from "~/services/cms/models/StrapiLink";

export const strapiLinkFactory = Factory.define<StrapiLink>(() => {
  return {
    url: faker.internet.url(),
    text: faker.lorem.words(),
    openInNewTab: faker.datatype.boolean(),
  };
});
