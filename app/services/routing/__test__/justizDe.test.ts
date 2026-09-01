import {
  isJustizDePath,
  justizDeHref,
  parseJustizDePath,
} from "~/services/routing/justizDe";

describe("isJustizDePath", () => {
  it.each([
    ["/justizde", true],
    ["/justizde/onlinedienste", true],
    ["/justizde/en/onlinedienste", true],
    ["/beratungshilfe/antrag", false],
    ["/", false],
  ])("returns %s for %s", (pathname, expected) => {
    expect(isJustizDePath(pathname)).toBe(expected);
  });
});

describe("parseJustizDePath", () => {
  it("defaults to German without a locale prefix", () => {
    expect(parseJustizDePath("/justizde/onlinedienste")).toEqual({
      locale: "de",
      slug: "/onlinedienste",
    });
  });

  it("keeps nested slugs intact", () => {
    expect(parseJustizDePath("/justizde/laender-bund-europa/BLK")).toEqual({
      locale: "de",
      slug: "/laender-bund-europa/BLK",
    });
  });

  it("strips the English locale prefix from the slug", () => {
    expect(parseJustizDePath("/justizde/en/onlinedienste")).toEqual({
      locale: "en",
      slug: "/onlinedienste",
    });
  });

  it("handles the localised index page", () => {
    expect(parseJustizDePath("/justizde/en")).toEqual({
      locale: "en",
      slug: "/",
    });
  });

  it("handles the bare prefix", () => {
    expect(parseJustizDePath("/justizde")).toEqual({ locale: "de", slug: "/" });
  });

  it("treats a page named like the default locale as a slug", () => {
    expect(parseJustizDePath("/justizde/de")).toEqual({
      locale: "de",
      slug: "/de",
    });
  });
});

describe("justizDeHref", () => {
  it("omits the prefix for the default locale", () => {
    expect(justizDeHref("de", "/onlinedienste")).toBe(
      "/justizde/onlinedienste",
    );
  });

  it("adds the prefix for other locales", () => {
    expect(justizDeHref("en", "/onlinedienste")).toBe(
      "/justizde/en/onlinedienste",
    );
  });

  it("round-trips with parseJustizDePath", () => {
    for (const locale of ["de", "en"] as const) {
      const href = justizDeHref(locale, "/laender-bund-europa/BLK");
      expect(parseJustizDePath(href)).toEqual({
        locale,
        slug: "/laender-bund-europa/BLK",
      });
    }
  });
});
