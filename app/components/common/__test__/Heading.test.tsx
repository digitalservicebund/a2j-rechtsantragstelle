import { render } from "@testing-library/react";
import Heading from "~/components/formElements/Heading";

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

  it("should use the correct tag to render the element", () => {
    const { getByRole } = render(<Heading text="text" tagName="h2" />);
    expect(getByRole("heading").tagName).toBe("H2");
  });

  it("should apply custom heading size", () => {
    const { getByRole } = render(<Heading text="test" size="medium" />);
    expect(getByRole("heading")).toHaveClass("kern-heading-medium");
  });
});
