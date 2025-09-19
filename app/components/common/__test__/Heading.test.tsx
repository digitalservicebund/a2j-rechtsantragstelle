import { render } from "@testing-library/react";
import Heading from "../Heading";

describe("Heading", () => {
  [undefined, "", "  "].forEach((text) => {
    it(`should not render the component in case text is ${text}`, () => {
      const { container } = render(<Heading text={text} />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  it("should render the component in case text is present", () => {
    const { getByRole } = render(<Heading text="test" />);
    expect(getByRole("heading")).toBeVisible();
  });

  it("should render the component in case children is present", () => {
    const { getByRole } = render(<Heading>test</Heading>);
    expect(getByRole("heading")).toBeVisible();
  });

  it("children take precedence over text", () => {
    const { getByRole } = render(<Heading text="text">child</Heading>);
    expect(getByRole("heading")).toHaveTextContent("child");
  });

  it("css looks are applied", () => {
    const { getByRole } = render(<Heading text="text" look="ds-body-01-reg" />);
    expect(getByRole("heading")).toHaveClass("ds-body-01-reg");
  });

  it("correct tag is used to render the element", () => {
    const { getByRole } = render(<Heading text="text" tagName="h2" />);
    expect(getByRole("heading").tagName).toBe("H2");
  });

  it("default css class isn't applied", () => {
    const { getByRole } = render(<Heading text="text" look="default" />);
    expect(getByRole("heading")).not.toHaveClass("default");
  });
});
