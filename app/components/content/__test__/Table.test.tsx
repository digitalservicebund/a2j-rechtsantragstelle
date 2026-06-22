import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Table from "../Table";

describe("Table", () => {
  it("should render table", () => {
    render(<Table columns={[]} rows={[]} __component={"page.table"} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should render table with heading and description", () => {
    render(
      <Table
        heading="Table Heading"
        description="Table Description"
        columns={[]}
        rows={[]}
        __component={"page.table"}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Table Heading" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Table Description")).toBeInTheDocument();
  });

  it("should render caption when heading exists", () => {
    render(
      <Table
        heading="Table Heading"
        columns={[]}
        rows={[]}
        __component={"page.table"}
      />,
    );
    const caption = screen.getByText("Table Heading", {
      selector: "caption",
    });
    expect(caption).toBeInTheDocument();
  });

  it("should render column headers", () => {
    render(
      <Table
        columns={[
          {
            label: "Column 1",
            id: 0,
          },
          {
            label: "Column 2",
            id: 0,
          },
        ]}
        rows={[]}
        __component={"page.table"}
      />,
    );

    expect(screen.getByText("Column 1")).toBeInTheDocument();
    expect(screen.getByText("Column 2")).toBeInTheDocument();
  });

  it("should not render thead when columns are empty", () => {
    render(<Table columns={[]} rows={[]} __component={"page.table"} />);

    expect(screen.queryByRole("thead")).toBeNull();
  });

  it("should render rows and cells", () => {
    render(
      <Table
        columns={[
          {
            label: "Column 1",
            id: 0,
          },
          {
            label: "Column 2",
            id: 0,
          },
        ]}
        rows={[
          {
            cells: [
              {
                content: "Row 1, Cell 1",
                id: 0,
              },
              {
                content: "Row 1, Cell 2",
                id: 0,
              },
            ],
            id: 0,
          },
          {
            cells: [
              {
                content: "Row 2, Cell 1",
                id: 0,
              },
              {
                content: "Row 2, Cell 2",
                id: 0,
              },
            ],
            id: 0,
          },
        ]}
        __component={"page.table"}
      />,
    );

    expect(screen.getByText("Row 1, Cell 1")).toBeInTheDocument();
    expect(screen.getByText("Row 1, Cell 2")).toBeInTheDocument();
    expect(screen.getByText("Row 2, Cell 1")).toBeInTheDocument();
    expect(screen.getByText("Row 2, Cell 2")).toBeInTheDocument();
  });

  it("shoudl render first cell as row header by default", () => {
    render(
      <Table
        columns={[
          {
            label: "Column 1",
            id: 0,
          },
        ]}
        rows={[
          {
            cells: [
              {
                content: "Row Header",
                id: 0,
              },
            ],
            id: 0,
          },
        ]}
        __component={"page.table"}
      />,
    );

    const cell = screen.getByText("Row Header");
    expect(cell.tagName).toBe("TH");
    expect(cell).toHaveAttribute("scope", "row");
  });

  it("should render correctly according to isHeader flag", () => {
    render(
      <Table
        columns={[
          {
            label: "Column 1",
            id: 0,
          },
        ]}
        rows={[
          {
            cells: [
              {
                content: "Normal",
                isHeader: false,
                id: 0,
              },
              {
                content: "Header",
                isHeader: true,
                id: 0,
              },
            ],
            id: 0,
          },
        ]}
        __component={"page.table"}
      />,
    );

    const headerCell = screen.getByText("Header");
    expect(headerCell.tagName).toBe("TH");
  });
});
