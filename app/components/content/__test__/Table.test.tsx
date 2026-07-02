import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Table from "../Table";

describe("Table", () => {
  const baseProps = {
    heading: { text: "Table Heading" },
    description: "Table Description",
    title: "Table Title",
  };

  const columns = [
    {
      id: 1,
      header: "Column 1",
    },
    {
      id: 2,
      header: "Column 2",
    },
  ];

  const rows = [
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
  ];

  it("should render table", () => {
    render(
      <Table
        heading={baseProps.heading}
        description={baseProps.description}
        title={baseProps.title}
        columns={columns}
        rows={rows}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should render table with heading and description", () => {
    render(
      <Table
        heading={baseProps.heading}
        description={baseProps.description}
        title={baseProps.title}
        columns={columns}
        rows={rows}
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
        heading={baseProps.heading}
        description={baseProps.description}
        title={baseProps.title}
        columns={columns}
        rows={rows}
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
        heading={baseProps.heading}
        description={baseProps.description}
        title={baseProps.title}
        columns={columns}
        rows={rows}
      />,
    );

    expect(screen.getByText("Column 1")).toBeInTheDocument();
    expect(screen.getByText("Column 2")).toBeInTheDocument();
  });

  it("should render row headers and cells", () => {
    render(
      <Table
        heading={baseProps.heading}
        description={baseProps.description}
        title={baseProps.title}
        columns={columns}
        rows={rows}
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
        heading={baseProps.heading}
        description={baseProps.description}
        title={baseProps.title}
        columns={columns}
        rows={rows}
      />,
    );

    const cells = screen.getAllByRole("cell");
    const headers = screen.getAllByRole("rowheader");

    expect(headers[0]).toHaveTextContent("Row Header");
    expect(cells[0]).toHaveTextContent("Row Content");
  });

  it("should render nothing when rows are empty", () => {
    const { container } = render(
      <Table
        heading={baseProps.heading}
        description={baseProps.description}
        title={baseProps.title}
        columns={columns}
        rows={[]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render nothing when columns are empty", () => {
    const { container } = render(
      <Table
        heading={baseProps.heading}
        description={baseProps.description}
        title={baseProps.title}
        columns={[]}
        rows={rows}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render nothing when both rows and columns are empty", () => {
    const { container } = render(
      <Table
        heading={baseProps.heading}
        description={baseProps.description}
        title={baseProps.title}
        columns={[]}
        rows={[]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
