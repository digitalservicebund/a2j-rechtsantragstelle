import { type useMatches } from "react-router";
import { metaFromMatches } from "~/services/meta/metaFromMatches";

describe("metaFromMatches", () => {
  it("should return an object with undefined property values if the input matches array isn't valid", () => {
    const undefinedMetaObject = {
      title: undefined,
      breadcrumbs: [],
      ogTitle: undefined,
      description: undefined,
    };
    // @ts-expect-error
    expect(metaFromMatches(undefined)).toEqual(undefinedMetaObject);
    // @ts-expect-error
    expect(metaFromMatches([{ loaderData: undefined }])).toEqual(
      undefinedMetaObject,
    );
  });

  it("should return the last match object's meta data", () => {
    const matches: ReturnType<typeof useMatches> = [
      {
        loaderData: {},
        id: "",
        pathname: "",
        params: {},
        data: undefined,
        handle: undefined,
      },
      {
        loaderData: {
          meta: {
            ogTitle: "OG Title 2",
            description: "Description 2",
          },
          cmsContent: {
            pageTitle: "Title 2",
          },
        },
        id: "",
        pathname: "",
        params: {},
        data: undefined,
        handle: undefined,
      },
    ];
    expect(metaFromMatches(matches)).toEqual({
      title: "Title 2",
      ogTitle: "OG Title 2",
      description: "Description 2",
    });
  });

  it("should take the match's meta.title and .content when .cmsContent.pageTitle and .meta.description are not present", () => {
    const matches: ReturnType<typeof useMatches> = [
      {
        loaderData: {
          meta: {
            title: "Title Override",
            ogTitle: "OG Title 2",
          },
          content: [
            {
              __component: "page.hero",
              content: {
                html: "Description Override",
              },
            },
          ],
        },
        id: "",
        pathname: "",
        params: {},
        data: undefined,
        handle: undefined,
      },
    ];
    expect(metaFromMatches(matches)).toEqual({
      title: "Title Override",
      ogTitle: "OG Title 2",
      description: "Description Override",
    });
  });
});
