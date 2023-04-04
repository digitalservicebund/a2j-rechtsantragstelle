import { getVorabCheckPageConfig } from "~/services/cms/getPageConfig";
import type { Locale } from "~/services/cms/models/Locale";

var data = {
  attributes: {},
};

const mockObject = {
  getPageFromCollection: jest.fn(
    (collection: string, pageName: string, locale?: Locale) => data.attributes
  ),
};

jest.mock("~/services/cms/index.tsx", () => () => mockObject);

beforeEach(() => {
  data = {
    attributes: {
      id: 1,
      value: "this is a test",
    },
  };
});

it("should return the right attributes for a slug", async () => {
  const result = await getVorabCheckPageConfig("http://localhost/page/test");
  expect(result).toEqual(data.attributes);
  expect(mockObject.getPageFromCollection).toHaveBeenCalledWith("page", "test");
});

it("should return undefined if no config is available", async () => {
  data.attributes = false;
  const result = await getVorabCheckPageConfig("http://localhost/test");
  expect(result).toBe(false);
});
