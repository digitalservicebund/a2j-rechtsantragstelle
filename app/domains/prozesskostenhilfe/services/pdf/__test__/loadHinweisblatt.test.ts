import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

describe("loadHinweisblatt", () => {
  it("should fail when the location of the PDF file has changed", () => {
    const originalPath = path.resolve(
      path.join(process.cwd(), "public", "Hinweisblatt_Prozesskostenhilfe.pdf"),
    );

    const fileExists = fs.existsSync(originalPath);
    expect(fileExists).toBe(true);
  });
});
