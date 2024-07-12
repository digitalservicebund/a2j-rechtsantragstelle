import { render, screen } from "@testing-library/react";
import RichText from "~/components/RichText";

describe("RichText component", () => {
  it("should render internal link", () => {
    const markdown = "[Link](/link)";
    render(<RichText markdown={markdown} />);
    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByText("Link")).toHaveAttribute("href", "/link");
    expect(screen.getByText("Link")).not.toHaveAttribute("target");
  });

  it("should render external link", () => {
    const markdown = "[Link](https://test.com)";
    render(<RichText markdown={markdown} />);
    const linkElem = screen.getByText("Link");
    expect(linkElem).toHaveAttribute("target", "_blank");
  });

  it("should handle ext: links for now", () => {
    const markdown = "[Link](ext:https://test.com)";
    render(<RichText markdown={markdown} />);
    const linkElem = screen.getByText("Link");
    expect(linkElem).toHaveAttribute("href", "https://test.com");
    expect(linkElem).toHaveAttribute("target", "_blank");
  });

  it("renders markdown style correctly", () => {
    const markdown = "# Heading\n\n**Bold** and *italic*";
    const { getByText } = render(<RichText markdown={markdown} />);

    expect(getByText("Heading")).toBeInTheDocument();
    expect(getByText("Bold")).toHaveStyle("font-weight: bold");
    expect(getByText("italic")).toHaveStyle("font-style: italic");
  });

  it("should apply className prop correctly", () => {
    const markdown = "Test markdown content";
    const className = "custom-class";
    const { container } = render(
      <RichText markdown={markdown} className={className} />,
    );

    expect(container.firstChild).toHaveClass("rich-text");
    expect(container.firstChild).toHaveClass("ds-stack-8");
    expect(container.firstChild).toHaveClass(className);
  });

  it("should handle empty markdown", () => {
    const markdown = "";
    const className = "custom-class";
    const { container } = render(
      <RichText markdown={markdown} className={className} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
