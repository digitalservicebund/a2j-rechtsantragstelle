import { cspHeader } from "~/services/security/cspHeader.server";

describe("cspHeader", () => {
  const defaultHeader = cspHeader();
  it("contains all OWASP recommended directives", () => {
    expect(defaultHeader).toContain("script-src");
    expect(defaultHeader).toContain("strict-dynamic");
    expect(defaultHeader).toContain("object-src");
    expect(defaultHeader).toContain("base-uri");
  });

  it("adds a nonce directives if added", () => {
    expect(cspHeader({ nonce: "r4nd0mN0nc3" })).toContain("nonce-r4nd0mN0nc3");
  });

  it("disables all framing", () => {
    expect(defaultHeader).toContain("frame-ancestors 'none'");
  });

  it("only adds localhost in development environment", () => {
    expect(defaultHeader).not.toContain("localhost");
    expect(cspHeader({ environment: "development" })).toContain("localhost");
  });
});
