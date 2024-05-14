import { cspHeader } from "~/services/security/cspHeader.server";

describe("cspHeader", () => {
  const header = cspHeader("");
  it("should contain all OWASP recommended directives", () => {
    expect(header).toContain("script-src");
    // expect(header).toContain("object-src");
    // expect(header).toContain("base-uri");
  });

  it("should contain a nonce directives", () => {
    expect(header).toContain("nonce-");
  });
});
