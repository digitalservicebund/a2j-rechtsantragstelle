import { describe, it, expect } from "vitest";
import { createHeaders } from "../pdfDownloadLoader";

describe("createHeaders", () => {
  it("should set pdf Content-Type", () => {
    expect(createHeaders("")["Content-Type"]).toBe("application/pdf");
  });

  it("should set URI encoded Content-Dispoisition", () => {
    expect(createHeaders("filename Ć.:.pdf")["Content-Disposition"]).toBe(
      "inline; filename=filename%20%C4%86.%3A.pdf",
    );
  });
});
