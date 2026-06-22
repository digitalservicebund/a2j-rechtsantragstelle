import { describe, it, expect } from "vitest";
import { StrapiTableSchema } from "../StrapiTable";

describe("StrapiTableSchema", () => {
  it("should parse a minimal table", () => {
    const data = {
      __component: "page.table",
      columns: [{ label: "Column 1" }, { label: "Column 2" }],
      rows: [
        {
          cells: [
            { content: "Row 1, Cell 1", isHeader: true },
            { content: "Row 1, Cell 2" },
          ],
        },
        {
          cells: [{ content: "Row 2, Cell 1" }, { content: "Row 2, Cell 2" }],
        },
      ],
    };

    const result = StrapiTableSchema.parse(data);
    expect(result).toBeDefined();
  });

  it("should parse with heading and description", () => {
    const data = {
      __component: "page.table",
      heading: "Table Heading",
      description: "Table Description",
      columns: [{ label: "Column 1" }, { label: "Column 2" }],
      rows: [
        {
          cells: [
            { content: "Row 1, Cell 1", isHeader: true },
            { content: "Row 1, Cell 2" },
          ],
        },
        {
          cells: [{ content: "Row 2, Cell 1" }, { content: "Row 2, Cell 2" }],
        },
      ],
    };

    const result = StrapiTableSchema.parse(data);
    expect(result.heading).toBe("Table Heading");
    expect(result.description).toBe("Table Description");
  });
});
