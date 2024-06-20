import { cspHeader } from "~/services/security/cspHeader.server";

describe("cspHeader", () => {
  const defaultHeader = cspHeader();
  it("contains all OWASP recommended directives", () => {
    expect(defaultHeader).toContain("script-src");
    expect(defaultHeader).toContain("object-src");
    expect(defaultHeader).toContain("base-uri");
  });

  it("adds nonce + strict-dynamic if provided", () => {
    expect(defaultHeader).not.toContain("'strict-dynamic'");

    const headerWithNonce = cspHeader({ nonce: "r4nd0mN0nc3" });
    expect(headerWithNonce).toContain("nonce-r4nd0mN0nc3");
    expect(headerWithNonce).toContain("'strict-dynamic'");
  });

  it("disables all framing", () => {
    expect(defaultHeader).toContain("frame-ancestors 'none'");
  });

  it("only adds localhost in development environment", () => {
    expect(defaultHeader).not.toContain("localhost");
    expect(cspHeader({ environment: "development" })).toContain("localhost");
  });

  it("adds maze header on preview", () => {
    expect(defaultHeader).not.toContain("https://snippet.maze.co");
    expect(defaultHeader).not.toContain("https://api.maze.co");
    expect(defaultHeader).not.toContain("https://prompts.maze.co");

    expect(cspHeader({ environment: "preview" })).toContain(
      "https://snippet.maze.co",
    );

    expect(
      cspHeader({ nonce: "r4nd0mN0nc3", environment: "preview" }),
    ).not.toContain("'strict-dynamic'");
  });
});
