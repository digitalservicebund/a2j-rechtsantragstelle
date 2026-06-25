import { describe, it, expect } from "vitest";
import { StrapiTableSchema } from "../StrapiTable";

describe("StrapiTableSchema", () => {
  it("should parse a minimal table", () => {
    const data = {
      __component: "page.table",
      heading: { text: "Table Heading", tagName: "h1", id: 1 },
      columns: [{ id: { id: 1 }, header: "Column 1" }],
      rows: [
        {
          id: 1,
          cells: [
            { id: 1, header: "Row Header", content: "Row Header 1" },
            { id: 2, header: "Row Header", content: "Row Data" },
            { id: 3, header: "Row Header", content: "Row Data" },
          ],
        },
      ],
    };
    const result = StrapiTableSchema.safeParse(data);
    expect(result).toBeDefined();
  });

  it("should parse with heading, description and title", () => {
    const data = {
      __component: "page.table",
      heading: { text: "Table Heading", tagName: "h1", id: 1 },
      description: "Table Description",
      title: "Table Title",
      columns: [
        { id: 1, header: "Column 1" },
        { id: 2, header: "Column 2" },
      ],
      rows: [
        {
          id: 1,
          cells: [
            { id: 1, header: "Row Header", content: "Row Header 1" },
            { id: 2, header: "Row Header", content: "Row Data" },
            { id: 3, header: "Row Header", content: "Row Data" },
          ],
        },
        {
          id: 2,
          cells: [
            { id: 4, header: "Row Header", content: "Row Header 2" },
            { id: 5, header: "Row Header", content: "Row Data" },
            { id: 6, header: "Row Header", content: "Row Data" },
          ],
        },
        {
          id: 3,
          cells: [
            { id: 7, header: "Row Header", content: "Row Header 3" },
            { id: 8, header: "Row Header", content: "Row Data" },
            { id: 9, header: "Row Header", content: "Row Data" },
          ],
        },
      ],
    };
    const result = StrapiTableSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.heading.text).toBe("Table Heading");
      expect(result.data.description).toBe("Table Description");
    }
  });

  it("should not parse when columns are missing", () => {
    const data = {
      __component: "page.table",
      heading: { text: "Table Heading", tagName: "h1", id: 1 },
      rows: [
        {
          id: 1,
          cells: [
            { id: 1, header: "Row Header", content: "Row Header 1" },
            { id: 2, header: "Row Header", content: "Row Data" },
            { id: 3, header: "Row Header", content: "Row Data" },
          ],
        },
      ],
    };
    const result = StrapiTableSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should not parse when rows are missing", () => {
    const data = {
      __component: "page.table",
      heading: { text: "Table Heading", tagName: "h1", id: 1 },
      columns: [{ id: 1, header: "Column 1" }],
    };
    const result = StrapiTableSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should not parse when heading is missing", () => {
    const data = {
      __component: "page.table",
      columns: [{ id: 1, header: "Column 1" }],
      rows: [
        {
          id: 1,
          cells: [
            { id: 1, header: "Row Header", content: "Row Header 1" },
            { id: 2, header: "Row Header", content: "Row Data" },
            { id: 3, header: "Row Header", content: "Row Data" },
          ],
        },
      ],
    };
    const result = StrapiTableSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should not parse when column header is missing", () => {
    const data = {
      __component: "page.table",
      heading: { text: "Table Heading", tagName: "h1", id: 1 },
      columns: [{ id: 1 }],
      rows: [
        {
          id: 1,
          cells: [
            { id: 1, header: "Row Header", content: "Row Header 1" },
            { id: 2, header: "Row Header", content: "Row Data" },
            { id: 3, header: "Row Header", content: "Row Data" },
          ],
        },
      ],
    };
    const result = StrapiTableSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should not parse when row has no cells", () => {
    const data = {
      __component: "page.table",
      heading: { text: "Table Heading", tagName: "h1", id: 1 },
      columns: [{ id: 1, header: "Column 1" }],
      rows: [
        {
          id: 1,
        },
      ],
    };
    const result = StrapiTableSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should not parse when cell content is missing", () => {
    const data = {
      __component: "page.table",
      heading: { text: "Table Heading", tagName: "h1", id: 1 },
      columns: [{ id: 1, header: "Column 1" }],
      rows: [
        {
          id: 1,
          cells: [{ id: 1, header: "Row Header" }],
        },
      ],
    };
    const result = StrapiTableSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
