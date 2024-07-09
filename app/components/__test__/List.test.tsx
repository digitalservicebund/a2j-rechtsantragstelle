import { render } from "@testing-library/react";
import List from "../List";

describe("List", () => {
  it("should render subheading when it is given", () => {
    const mockSubheadinText = "subheadingText";

    const { getByText } = render(
      <List items={[]} subheading={mockSubheadinText} />,
    );

    expect(getByText(mockSubheadinText)).toBeInTheDocument();
  });

  it("should not render subheading when it is not given", () => {
    const mockSubheadinText = "subheadingText";
    const { queryByText } = render(<List items={[]} />);

    expect(queryByText(mockSubheadinText)).not.toBeInTheDocument();
  });
});
