import { getRedirect } from "~/services/routing/redirects";

describe("getRedirect", () => {
  it("returns a redirect on match", () => {
    expect(getRedirect("/datenschutz")).toEqual("/datenschutzerklaerung");
  });
  it("returns undefined else", () => {
    expect(getRedirect("")).toBeUndefined();
  });
});
