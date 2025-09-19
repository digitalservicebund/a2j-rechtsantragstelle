import { fetchMeta } from "~/services/cms/index.server";
import { buildBreadcrumbPromises } from "../breadcrumbs";

vi.mock("~/services/cms/index.server");

describe("buildBreadcrumbPromises", () => {
  it("should return all breadcrumbs as promises", async () => {
    vi.mocked(fetchMeta).mockImplementation(({ filterValue }) =>
      Promise.resolve({ title: "", breadcrumb: filterValue }),
    );
    const actual = await buildBreadcrumbPromises("/my/pretty/pathname");
    expect(actual).toEqual([
      { url: "/my", title: "/my" },
      { url: "/my/pretty", title: "/my/pretty" },
      { url: "/my/pretty/pathname", title: "/my/pretty/pathname" },
    ]);
  });

  it("should handle undefined", async () => {
    vi.mocked(fetchMeta).mockResolvedValueOnce({
      title: "",
    });
    const actual = await buildBreadcrumbPromises("/test");

    expect(actual).toEqual([{ url: "/test", title: undefined }]);
  });

  describe("should handle edge cases", () => {
    vi.mocked(fetchMeta).mockResolvedValue({
      title: "",
      breadcrumb: "breadcrumb",
    });
    const edgeCases = ["", "/", ".", "..", "justAWord"];

    edgeCases.forEach((badPathname) => {
      it(`returns nothing for ${badPathname}`, async () => {
        expect(await buildBreadcrumbPromises(badPathname)).toEqual([]);
      });
    });
  });
});
