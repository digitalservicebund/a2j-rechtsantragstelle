import { cspHeader } from "~/services/security/cspHeader.server";

describe("cspHeader", () => {
  const defaultArgs = {
    nonce: "r4nd0mN0nc3",
    environment: "test",
    trustedDomains: ["https://trusted.com"],
  };

  it("contains all OWASP recommended directives", () => {
    const defaultHeader = cspHeader(defaultArgs);

    expect(defaultHeader).toContain("script-src");
    expect(defaultHeader).toContain("object-src");
    expect(defaultHeader).toContain("base-uri");
    expect(defaultHeader).toContain("frame-ancestors 'none'");

    const scriptDirective = defaultHeader
      .split(";")
      .find((directive) => directive.startsWith("script-src"));
    expect(scriptDirective).toContain("nonce-r4nd0mN0nc3");
    expect(scriptDirective).toContain("'strict-dynamic'");
    expect(scriptDirective).toContain("https://trusted.com");
    expect(scriptDirective).not.toContain("unsafe-inline");
  });

  it("adds report URI if passed", () => {
    const reportCspHeaders = cspHeader({
      ...defaultArgs,
      reportUri: "https://reportCsp.com",
    });
    expect(reportCspHeaders).toContain("report-to");
    expect(reportCspHeaders).toContain("https://reportCsp.com");
  });

  it("only adds localhost in development environment", () => {
    expect(cspHeader(defaultArgs)).not.toContain("localhost");

    const developmentCspHeaders = cspHeader({
      nonce: "r4nd0mN0nc3",
      environment: "development",
      trustedDomains: ["https://trusted.com"],
    });
    expect(developmentCspHeaders).toContain("localhost");
  });
});
