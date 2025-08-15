import { render } from "@testing-library/react";
import TableOfContents from "../content/TableOfContents";

describe("TableOfContents", () => {
  it("render component with identifier", () => {
    const { container } = render(
      <TableOfContents identifier="someIdentifier" />,
    );

    expect(container.querySelector("#someIdentifier")).toBeInTheDocument();
  });

  it("render component with label", () => {
    const { queryByText } = render(
      <TableOfContents label={{ text: "someLabel" }} />,
    );

    expect(queryByText("someLabel")).toBeInTheDocument();
  });

  it("render component with heading", () => {
    const { queryByText } = render(
      <TableOfContents heading={{ text: "someHeading" }} />,
    );

    expect(queryByText("someHeading")).toBeInTheDocument();
  });

  it("render component with links", () => {
    const { queryAllByRole } = render(
      <TableOfContents links={[{ text: "someLink", url: "/test" }]} />,
    );

    expect(queryAllByRole("link")[0]).toBeInTheDocument();
    expect(queryAllByRole("link")[0].textContent).toBe("someLink");
    expect(queryAllByRole("link")[0].getAttribute("href")).toBe("/test");
  });

  it("render component with buttons", () => {
    const { queryAllByRole } = render(
      <TableOfContents buttons={[{ text: "someButton", href: "/test" }]} />,
    );

    expect(queryAllByRole("link")[0]).toBeInTheDocument();
    expect(queryAllByRole("link")[0].getAttribute("href")).toBe("/test");
  });
});
