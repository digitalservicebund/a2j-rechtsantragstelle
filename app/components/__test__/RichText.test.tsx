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

  it("should open external link in new tab", () => {
    const markdown = "[Link](https://test.com)";
    render(<RichText markdown={markdown} />);
    const linkElem = screen.getByText("Link");
    expect(linkElem).toHaveAttribute("target", "_blank");
    expect(linkElem).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should add icon to external links", () => {
    const markdown = "[Link](https://test.com)";
    render(<RichText markdown={markdown} />);
    const linkElem = screen.getByText("Link");
    const icon = linkElem.querySelector("svg");
    expect(linkElem).toContainElement(icon);
    expect(icon).not.toBe(null);
    expect(icon).toHaveAttribute("focusable", "false");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toContainElement(icon!.querySelector("path"));
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

  describe("heading rendering", () => {
    it("should render h1 heading with the correct styling", () => {
      const markdown = "# Heading";
      const { getByText } = render(<RichText markdown={markdown} />);

      expect(getByText("Heading")).toHaveClass("ds-heading-01-reg");
    });

    it("should render h2 heading with the correct styling", () => {
      const markdown = "## Heading";
      const { getByText } = render(<RichText markdown={markdown} />);

      expect(getByText("Heading")).toHaveClass("ds-heading-02-reg");
    });

    it("should render h3 heading with the correct styling", () => {
      const markdown = "### Heading";
      const { getByText } = render(<RichText markdown={markdown} />);

      expect(getByText("Heading")).toHaveClass("ds-label-01-bold");
    });

    it("should render h4 heading with the correct styling", () => {
      const markdown = "#### Heading";
      const { getByText } = render(<RichText markdown={markdown} />);

      expect(getByText("Heading")).toHaveClass("ds-label-01-bold");
    });

    it("should render h5 heading with the correct styling", () => {
      const markdown = "##### Heading";
      const { getByText } = render(<RichText markdown={markdown} />);

      expect(getByText("Heading")).toHaveClass("ds-label-01-bold");
    });

    it("should render h6 heading with the correct styling", () => {
      const markdown = "###### Heading";
      const { getByText } = render(<RichText markdown={markdown} />);

      expect(getByText("Heading")).toHaveClass("ds-label-01-bold");
    });
  });
});
