import { render } from "@testing-library/react";
import { MissingDataList } from "../common/MissingDataList";
import type { NavItem } from "../navigation/types";

const mockNavItems = [
  { label: "label1", destination: "/1", state: "Current" },
  { label: "label2", destination: "/2", state: "Warning" },
  {
    label: "label3",
    state: "Open",
    destination: "1",
    subflows: [
      { label: "label4", destination: "/4", state: "Current" },
      { label: "label5", destination: "/5", state: "Warning" },
    ],
  },
] satisfies NavItem[];

describe("MissingDataList", () => {
  it("should render only items in the Warning state", () => {
    const { getByText, queryByText } = render(
      <MissingDataList navItems={mockNavItems} shouldRender={true} />,
    );
    expect(queryByText("label1")).not.toBeInTheDocument();
    expect(getByText("label2")).toBeVisible();
  });

  it("should render subflow items in the Warning state with their parent", () => {
    const { getByText, queryByText } = render(
      <MissingDataList navItems={mockNavItems} shouldRender={true} />,
    );
    expect(queryByText("label4")).not.toBeInTheDocument();
    expect(getByText("label3: label5")).toBeVisible();
  });

  it("should not render without shouldRender", () => {
    const { container } = render(<MissingDataList navItems={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("should not render with shouldRender=False", () => {
    const { container } = render(
      <MissingDataList navItems={[]} shouldRender={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
