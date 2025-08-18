import { render } from "@testing-library/react";
import Heading from "../common/Heading";

describe("Heading", () => {
  it("should not render the component in case text is empty and has not children element", () => {
    const { container } = render(<Heading text="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should not render the component in case text is undefined and has not children element", () => {
    const { container } = render(<Heading />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should not render the component in case text has empty space and has not children element", () => {
    const { container } = render(<Heading text="  " />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render the component in case text is present", () => {
    const { container } = render(<Heading text="test" />);

    expect(container).not.toBeEmptyDOMElement();
  });

  it("should render the component in case children is present", () => {
    const { container } = render(
      <Heading>
        <div>test</div>
      </Heading>,
    );

    expect(container).not.toBeEmptyDOMElement();
  });
});
