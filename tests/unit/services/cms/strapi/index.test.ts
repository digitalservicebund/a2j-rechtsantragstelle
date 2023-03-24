import { Locale } from "~/services/cms/models/Locale";
import StrapiCMS from "~/services/cms/strapi";
import {
  IClient,
  Parameter,
  RequestBuilder,
} from "~/services/cms/strapi/client";

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
  const result = await strapiCMS.getMenu("1", Locale.de);

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
  const result = await strapiCMS.getPage(pageName, Locale.de);

  expect(mockObject.getDocument).toBeCalledWith(
    pageName,
    new RequestBuilder().setLocale(Locale.de).toRequest()
  );
  expect(result).toEqual(document.attributes);
});

it("should return a page by slug", async () => {
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
  const result = await strapiCMS.getPageBySlug("test", Locale.de);

  expect(mockObject.getDocument).toBeCalledWith(
    "pages",
    new RequestBuilder()
      .setLocale(Locale.de)
      .addFilter({
        field: "slug",
        value: slug,
      })
      .toRequest()
  );
  expect(result).toEqual(document.attributes);
});
