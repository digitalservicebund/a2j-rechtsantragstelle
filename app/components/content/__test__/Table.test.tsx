import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Table from "../Table";

describe("Table", () => {
  it("should render table", () => {
    render(
      <Table
        heading={{ text: "" }}
        description=""
        title=""
        columns={[]}
        rows={[]}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should render table with heading and description", () => {
    render(
      <Table
        heading={{ text: "Table Heading" }}
        description="Table Description"
        title="Table Title"
        columns={[]}
        rows={[]}
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
        heading={{ text: "Table Heading" }}
        description="Table Description"
        title="Table Title"
        columns={[]}
        rows={[]}
      />,
    );
    const caption = screen.getByText("Table Title", {
      selector: "caption",
    });
    expect(caption).toBeInTheDocument();
  });

  it("should render column headers", () => {
    render(
      <Table
        heading={{ text: "Table Heading" }}
        description="Table Description"
        title="Table Title"
        columns={[
          {
            header: "Column 1",
            id: 1,
          },
          {
            header: "Column 2",
            id: 2,
          },
        ]}
        rows={[]}
      />,
    );

    expect(screen.getByText("Column 1")).toBeInTheDocument();
    expect(screen.getByText("Column 2")).toBeInTheDocument();
  });

  it("should not render thead when columns are empty", () => {
    render(
      <Table
        heading={{ text: "Table Heading" }}
        description="Table Description"
        title="Table Title"
        columns={[]}
        rows={[]}
      />,
    );

    expect(screen.queryAllByRole("columnheader")).toHaveLength(0);
  });

  it("should render first cell as row header and the following as data cells", () => {
    render(
      <Table
        heading={{ text: "Table Heading" }}
        description="Table Description"
        title="Table Title"
        columns={[
          {
            id: 1,
            header: "Column 1",
          },
        ]}
        rows={[
          {
            id: 1,
            cells: [
              {
                id: 1,
                header: "Row Header",
                content: "Row Content",
              },
              {
                id: 2,
                header: "Ignored Row Header",
                content: "Row Content",
              },
            ],
          },
        ]}
      />,
    );

    const rowHeader = screen.getByText("Row Header");
    const rowContent = screen.getByText("Row Content");

    expect(rowHeader.tagName).toBe("TH");
    expect(rowHeader).toHaveAttribute("scope", "row");

    expect(rowContent.tagName).toBe("TD");
  });

  it("should render the correct cell type for each position", () => {
    render(
      <Table
        heading={{ text: "Table Heading" }}
        description="Table Description"
        title="Table Title"
        columns={[
          {
            id: 1,
            header: "Column 1",
          },
        ]}
        rows={[
          {
            id: 1,
            cells: [
              {
                id: 1,
                header: "Row Header",
                content: "Row Content",
              },
              {
                id: 2,
                header: "Row Header",
                content: "Row Content",
              },
            ],
          },
        ]}
      />,
    );

    const cells = screen.getAllByRole("cell");
    const headers = screen.getAllByRole("rowheader");

    expect(headers[0]).toHaveTextContent("Row Header");
    expect(cells[0]).toHaveTextContent("Row Content");
  });
});
