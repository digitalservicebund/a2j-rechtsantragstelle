import StrapiCMS from "~/services/cms/strapi";
import { Parameter, RequestBuilder } from "~/services/cms/strapi/client";
import type { IClient } from "~/services/cms/strapi/client";

var document = {
  attributes: {
    items: {
      data: [{}],
    },
  },
};

const mockObject: IClient = {
  getDocument: jest
    .fn()
    .mockImplementation((documentCollection: string, request: Request) => {
      return Promise.resolve(document);
    }),
};

beforeEach(() => {
  document = {
    attributes: {
      items: {
        data: [{}],
      },
    },
  };
});

it("should return a menu", async () => {
  const data = [
    {
      id: 1,
      attributes: {
        id: 1,
        value: "this is a test",
      },
    },
  ];

  document.attributes.items.data = data;

  const strapiCMS = new StrapiCMS(mockObject);
  const result = await strapiCMS.getMenu("1", "de");

  expect(mockObject.getDocument).toBeCalledWith(
    "menus",
    new RequestBuilder()
      .setFilter({
        field: "slug",
        value: `1_de`,
      })
      .addParameter(Parameter.nested)
      .toRequest()
  );
  expect(result).toEqual([data[0].attributes]);
});

it("should return a page", async () => {
  const data = [
    {
      id: 1,
      attributes: {
        id: 1,
        value: "this is a test",
      },
    },
  ];
  const pageName = "1";

  document.attributes.items.data = data;

  const strapiCMS = new StrapiCMS(mockObject);
  const result = await strapiCMS.getPage(pageName, "de");

  expect(mockObject.getDocument).toBeCalledWith(
    pageName,
    new RequestBuilder().setLocale("de").toRequest()
  );
  expect(result).toEqual(document.attributes);
});

it("should return a page by name", async () => {
  const data = [
    {
      id: 1,
      attributes: {
        id: 1,
        value: "this is a test",
      },
    },
  ];
  const slug = "test";

  document.attributes.items.data = data;

  const strapiCMS = new StrapiCMS(mockObject);
  const result = await strapiCMS.getPageFromCollection("", slug, "de");

  expect(mockObject.getDocument).toBeCalledWith(
    "pages",
    new RequestBuilder()
      .setLocale("de")
      .addFilter({
        field: "slug",
        value: slug,
      })
      .toRequest()
  );
  expect(result).toEqual(document.attributes);
});
