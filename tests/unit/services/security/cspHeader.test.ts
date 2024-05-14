import { cspHeader } from "~/services/security/cspHeader.server";

describe("cspHeader", () => {
  const header = cspHeader("");
  it("should contain all OWASP recommended directives", () => {
    expect(header).toContain("script-src");
    expect(header).toContain("strict-dynamic");
    expect(header).toContain("object-src");
    expect(header).toContain("base-uri");
  });

  it("should contain a nonce directives", () => {
    expect(header).toContain("nonce-");
  });

  it("disables all framing", () => {
    expect(header).toContain("frame-ancestors 'none'");
  });
});
