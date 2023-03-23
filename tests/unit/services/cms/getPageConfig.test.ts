import getPageConfig from "~/services/cms/getPageConfig";

var data = {};

const mockObject = {
  getPageBySlug: jest.fn().mockImplementation((slug: string) => data),
};

jest.mock("~/services/cms/index.tsx", () => () => mockObject);

beforeEach(() => {
  data = {
    attributes: ["this is a test"],
  };
});

it("should return the right attributes for a slug", async () => {
  const result = await getPageConfig("http://localhost/test", {
    dontThrow: false,
  });

  expect(result).toEqual(["this is a test"]);
  expect(mockObject.getPageBySlug).toHaveBeenCalledWith("test");
});

it("should return a error if no data is available and dontThrow is true", async () => {
  expect.assertions(1);
  data = false;

  return await getPageConfig("http://localhost/test", {
    dontThrow: false,
  }).catch((e) => expect(e.message).toEqual("No page config found!"));
});

it("should not throw a error and return undefined if dontThrow is false", async () => {
  data = false;

  const result = await getPageConfig("http://localhost/test", {
    dontThrow: true,
  });

  expect(result).toBe(undefined);
});
