import { render, screen } from "@testing-library/react";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import { NavItem } from "~/components/navigation/NavItem";
import { NavState } from "~/services/navigation/navState";

const dummyNavItems: NavItem[] = [
  { destination: "/page1", label: "Page 1", state: NavState.Current },
  { destination: "/page2", label: "Page 2", state: NavState.DoneCurrent },
];

describe("FlowNavigation", () => {
  it("renders a navigation element with the correct aria-label", () => {
    render(
      <FlowNavigation
        navItems={dummyNavItems}
        a11yLabels={{ menuLabel: "Main Menu", itemFinished: "", itemOpen: "" }}
      />,
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-label", "Main Menu");
  });

  it("renders the SideNavMobile with fixed props", () => {
    render(<FlowNavigation navItems={dummyNavItems} />);
    expect(screen.getByText(/Bereich/i)).toBeInTheDocument();
    expect(screen.getByText(/Anwaltliche Vertretung/i)).toBeInTheDocument();
  });
});
