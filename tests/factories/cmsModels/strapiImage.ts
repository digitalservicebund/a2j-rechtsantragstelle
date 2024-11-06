import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { StrapiImage } from "~/services/cms/models/StrapiImage";

export const strapiImageFactory = Factory.define<StrapiImage>(() => {
  const name = faker.string.alphanumeric({ length: 5 });
  const hash = faker.string.alphanumeric({ length: 10 });
  const ext = faker.helpers.arrayElement(["png", "jpg", "svg", "gif"]);

  return {
    data: {
      attributes: {
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
        // eslint-disable-next-line camelcase
        provider_metadata: null,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
    },
  };
});
