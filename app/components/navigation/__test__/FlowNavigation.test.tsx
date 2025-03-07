import { render } from "@testing-library/react";
import FlowNavigation from "~/components/navigation/FlowNavigation";

describe("FlowNavigation", () => {
  it("renders a navigation", () => {
    const { getByRole } = render(<FlowNavigation navItems={[]} />);
    const navigation = getByRole("navigation");
    expect(navigation).toBeInTheDocument();
  });

  it("renders the correct aria-label", () => {
    const { getByRole } = render(
      <FlowNavigation
        navItems={[]}
        a11yLabels={{ menuLabel: "Main Menu", itemFinished: "", itemOpen: "" }}
      />,
    );
    expect(getByRole("navigation")).toHaveAttribute("aria-label", "Main Menu");
  });
});
