import { headers, defaultHeaders } from "~/rootHeaders";

const mockHeaders = (headers: Record<string, string>) => new Headers(headers);

describe("Headers", () => {
  const mockheaders = {
    parentHeaders: mockHeaders({}),
    actionHeaders: mockHeaders({}),
    errorHeaders: mockHeaders({}),
    loaderHeaders: mockHeaders({}),
  };

  it("should set default security headers", () => {
    expect(headers({ ...mockheaders })).toEqual(defaultHeaders);
  });

  describe("Cache-Control", () => {
    it("not set by default", () => {
      expect(headers(mockheaders)).not.toHaveProperty("Cache-Control");
    });

    it("sets no-store when passing shouldAddCacheControl loaderHeader", () => {
      const loaderHeaders = mockHeaders({ shouldAddCacheControl: "true" });
      expect(
        headers({ ...mockheaders, loaderHeaders })["Cache-Control"],
      ).toEqual("no-store");
    });
  });
});
