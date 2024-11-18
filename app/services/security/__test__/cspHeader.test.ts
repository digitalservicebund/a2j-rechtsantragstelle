import { cspHeader } from "~/services/security/cspHeader.server";

describe("cspHeader", () => {
  const defaultArgs = {
    nonce: "r4nd0mN0nc3",
    environment: "test",
    additionalConnectSrc: ["https://trusted.com"],
  };

  it("contains all OWASP recommended directives", () => {
    const defaultHeader = cspHeader(defaultArgs);

    expect(defaultHeader).toContain("default-src 'self';");
    expect(defaultHeader).toContain("object-src");
    expect(defaultHeader).toContain("base-uri");
    expect(defaultHeader).toContain("form-action");
    expect(defaultHeader).toContain("frame-src");
    expect(defaultHeader).toContain("style-src");
    expect(defaultHeader).toContain("img-src");
    expect(defaultHeader).toContain("upgrade-insecure-requests");
    expect(defaultHeader).toContain("frame-ancestors 'none'");

    const scriptDirective = defaultHeader
      .split(";")
      .find((directive) => directive.startsWith("script-src"));
    expect(scriptDirective).toContain("nonce-r4nd0mN0nc3");
    expect(scriptDirective).toContain("'strict-dynamic'");
    expect(scriptDirective).not.toContain("unsafe-inline");
  });

  it("passed additionalConnectSrc to appear", () => {
    expect(cspHeader(defaultArgs)).toContain("https://trusted.com");
  });

  it("adds report-to & report-uri if provided", () => {
    const reportCspHeaders = cspHeader({
      ...defaultArgs,
      reportUri: "https://reportCsp.com",
    });
    expect(reportCspHeaders).toContain("report-to");
    expect(reportCspHeaders).toContain("https://reportCsp.com");
  });

  it("doesn't reference localhost by default", () => {
    expect(cspHeader(defaultArgs)).not.toContain("localhost");
  });

  it("only adds localhost in development environment", () => {
    const developmentCspHeaders = cspHeader({
      nonce: "r4nd0mN0nc3",
      environment: "development",
      additionalConnectSrc: ["https://trusted.com"],
    });
    expect(developmentCspHeaders).toContain("localhost");
    expect(developmentCspHeaders).not.toContain("upgrade-insecure-requests");
  });
});
