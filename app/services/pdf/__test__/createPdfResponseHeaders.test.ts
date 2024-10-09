import { createPdfResponseHeaders } from "../createPdfResponseHeaders";

describe("createPdfResponseHeaders", () => {
  it("should set pdf Content-Type", () => {
    expect(createPdfResponseHeaders("", 10)["Content-Type"]).toBe(
      "application/pdf",
    );
  });

  it("should set URI encoded Content-Dispoisition", () => {
    expect(
      createPdfResponseHeaders("filename Ć.:.pdf", 10)["Content-Disposition"],
    ).toBe("inline; filename=filename%20%C4%86.%3A.pdf");
  });

  it("should set Content-Length", () => {
    expect(
      createPdfResponseHeaders("filename Ć.:.pdf", 10)["Content-Length"],
    ).toBe("10");
  });
});
