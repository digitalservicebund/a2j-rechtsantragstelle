import FileCMS from "~/services/cms/file";
import * as client from "~/services/cms/file/client";

const getSinglePageAttributes = (name: string) => {
  return {
    createdAt: "2023-04-06T14:00:14.473Z",
    updatedAt: "2023-04-12T11:12:02.797Z",
    publishedAt: "2023-04-06T14:00:16.001Z",
    relation: {
      data: {
        id: 14,
        attributes: {
          name: "Name",
          createdAt: "2023-04-06T13:58:37.139Z",
          updatedAt: "2023-04-12T11:10:08.605Z",
        },
      },
    },
    connectedList: [
      {
        id: 59,
        text: "Text",
      },
      {
        id: 60,
        text: "Text 2",
      },
    ],
    name: name,
  };
};

const getCollectionPageAttributes = (name: string) => {
  return {
    slug: name,
    createdAt: "2023-03-24T14:18:25.454Z",
    updatedAt: "2023-05-08T18:39:20.146Z",
    publishedAt: "2023-03-24T14:18:27.367Z",
    locale: "de",
    meta: {
      id: 9,
      title: "Title",
    },
    content: [
      {
        id: 9,
        __component: "basic.heading",
        text: "Heading",
        tagName: "h1",
        look: "ds-heading-02-reg",
      },
    ],
  };
};

const getExampleSinglePage = (name: string) => {
  const pageAttributes = getSinglePageAttributes(name);
  return {
    [name]: {
      id: 1,
      attributes: { ...pageAttributes },
    },
  };
};

const getExampleCollectionPage = (name: string) => {
  const pageAttributes = getCollectionPageAttributes(name);
  return {
    id: 1,
    attributes: { ...pageAttributes },
  };
};

beforeAll(() => {
  const page1 = getExampleSinglePage("page");
  const page2 = getExampleSinglePage("page2");
  const collectionPage1 = getExampleCollectionPage("collectionPage1");
  const collectionPage2 = getExampleCollectionPage("collectionPage2");
  const defaultPage = getExampleCollectionPage("defaultPage");
  const mockContent = {
    ...page1,
    ...page2,
    "result-pages": [collectionPage1, collectionPage2],
    pages: [defaultPage],
  };

  const contentMock = jest.spyOn(client, "loadContentFile");
  // @ts-ignore
  contentMock.mockReturnValue(mockContent);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("getPage", () => {
  it("should return the correct page", async () => {
    const returnedPage = await new FileCMS().getPage("page");
    expect(returnedPage).toEqual(getSinglePageAttributes("page"));
  });

  it("should return undefined if page does not exist", async () => {
    const returnedPage = await new FileCMS().getPage("non-existent");
    expect(returnedPage).toEqual(undefined);
  });
});

describe("getPageFromCollection", () => {
  it("should return the correct page if collection in map", async () => {
    const returnedPage = await new FileCMS().getPageFromCollection(
      "resultPage",
      "collectionPage1"
    );
    expect(returnedPage).toEqual(
      getCollectionPageAttributes("collectionPage1")
    );
  });

  it("should return the correct page from pages collection if collection not in map", async () => {
    const returnedPage = await new FileCMS().getPageFromCollection(
      "non-existent",
      "defaultPage"
    );
    expect(returnedPage).toEqual(getCollectionPageAttributes("defaultPage"));
  });

  it("should return undefined if page does not exist", async () => {
    const returnedPage = await new FileCMS().getPageFromCollection(
      "resultPage",
      "non-existent"
    );
    expect(returnedPage).toEqual(undefined);
  });

  it("should return undefined if collection does not exist", async () => {
    const returnedPage = await new FileCMS().getPageFromCollection(
      "non-existent",
      "page"
    );
    expect(returnedPage).toEqual(undefined);
  });
});
