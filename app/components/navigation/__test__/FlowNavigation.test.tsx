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
    const { getByRole } = render(<FlowNavigation />);
    const navigation = getByRole("navigation");
    expect(navigation).toBeInTheDocument();
  });

  it("renders the correct aria-label", () => {
    const { getByRole } = render(<FlowNavigation />);
    expect(getByRole("navigation")).toHaveAttribute("aria-label", "Main Menu");
  });

  it("correctly renders child elements", () => {
    const childText = "child";
    const { getByText } = render(
      <FlowNavigation>
        <div>{childText}</div>
      </FlowNavigation>,
    );
    expect(getByText(childText)).toBeInTheDocument();
  });
});
