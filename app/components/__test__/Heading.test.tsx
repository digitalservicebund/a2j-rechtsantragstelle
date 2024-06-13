import { render } from "@testing-library/react";
import Heading from "../Heading";

describe("Heading", () => {
  it("should not render the component in case text is empty", () => {
    const { container } = render(<Heading text="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should not render the component in case text is undefined", () => {
    const { container } = render(<Heading />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should not render the component in case text has empty space", () => {
    const { container } = render(<Heading text="  " />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render the component in case text is present", () => {
    const { container } = render(<Heading text="test" />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
