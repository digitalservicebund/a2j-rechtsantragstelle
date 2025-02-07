import { faker } from "@faker-js/faker";
import { StrapiImage } from "~/services/cms/models/StrapiImage";

export function getStrapiImage(): StrapiImage {
  const name = faker.string.alphanumeric({ length: 5 });
  const hash = faker.string.alphanumeric({ length: 10 });
  const ext = faker.helpers.arrayElement(["png", "jpg", "svg", "gif"]);

  return {
    name: `${name}.${ext}`,
    url: `${faker.internet.url()}/${name}_${hash}.${ext}`,
    previewUrl: null,
    width: faker.number.int({ min: 1, max: 640 }),
    height: faker.number.int({ min: 1, max: 480 }),
    size: faker.number.float({ max: 10, multipleOf: 0.01 }),
    alternativeText: faker.lorem.sentence(),
    ext: `.${ext}`,
    mime: `image/${ext}`,
    caption: null,
    formats: null,
    hash: `${name}_${hash}`,
    provider: "aws-s3",
    provider_metadata: null,
  };
}
