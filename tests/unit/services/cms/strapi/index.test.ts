import { Locale } from "~/services/cms/models/Locale";
import StrapiCMS from "~/services/cms/strapi";
import type { IClient } from "~/services/cms/strapi/client";

var document = {};
var documents = [document];

const mockObject: IClient = {
  getDocument: jest
    .fn()
    .mockImplementation((documentCollection: string, request: Request) => {
      return Promise.resolve(document);
    }),
  getDocuments: jest
    .fn()
    .mockImplementation((documentCollection: string, request: Request) => {
      return Promise.resolve(documents);
    }),
};

beforeEach(() => {
  document = {
    attributes: {},
  };
  documents = [document];
});

it("should return a menu", async () => {
  const strapiCMS = new StrapiCMS(mockObject);

  //const result = await strapiCMS.getMenu("1", Locale.de);
});
