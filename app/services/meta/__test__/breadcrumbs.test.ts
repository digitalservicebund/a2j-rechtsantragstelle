import { fetchMeta } from "~/services/cms/index.server";
import { buildBreadcrumbPromises } from "../breadcrumbs";

vi.mock("~/services/cms/index.server");

describe("buildBreadcrumbPromises", () => {
  it("should return all breadcrumbs as promises", async () => {
    vi.mocked(fetchMeta).mockImplementation(({ filterValue }) =>
      Promise.resolve({
        title: "",
        description: null,
        ogTitle: null,
        breadcrumb: filterValue,
      }),
    );

    const actual = await buildBreadcrumbPromises("/my/pretty/pathname");

    expect(actual).toEqual([
      { url: "/my", title: "/my" },
      { url: "/my/pretty", title: "/my/pretty" },
      { url: "/my/pretty/pathname", title: "/my/pretty/pathname" },
    ]);
  });
});
