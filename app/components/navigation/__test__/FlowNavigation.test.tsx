import { render } from "@testing-library/react";
import FlowNavigation from "~/components/navigation/FlowNavigation";

vi.mock("react-router", () => ({
  useRouteLoaderData: vi.fn(() => ({
    accessibilityTranslations: {
      navigationLabel: "Main Menu",
    },
  })),
}));

describe("FlowNavigation", () => {
  it("renders a navigation", () => {
    const { getByRole } = render(<FlowNavigation navItems={[]} />);
    const navigation = getByRole("navigation");
    expect(navigation).toBeInTheDocument();
  });

  it("renders the correct aria-label", () => {
    const { getByRole } = render(<FlowNavigation navItems={[]} />);
    expect(getByRole("navigation")).toHaveAttribute("aria-label", "Main Menu");
  });
});
