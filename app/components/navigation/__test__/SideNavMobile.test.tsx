import { render, fireEvent } from "@testing-library/react";
import type { NavItem } from "~/components/navigation/NavItem";
import { NavState } from "~/services/navigation/navState";
import SideNavMobile from "../SideNavMobile";

const dummyNavItems: NavItem[] = [
  { destination: "/page1", label: "Page 1", state: NavState.Current },
  { destination: "/page2", label: "Page 2", state: NavState.Open },
];

describe("SideNavMobile", () => {
  const labelsValues = {
    currentArea: "Menu",
    closeMenu: "Close Menu",
    toggleMenu: "Toggle Menu",
  };
  it("clicking the menu opens the menu", () => {
    const { container, getByRole } = render(
      <SideNavMobile labels={labelsValues} navItems={dummyNavItems} />,
    );

    const menuButton = getByRole("button");
    expect(container).not.toHaveTextContent("Page 2");
    fireEvent.click(menuButton);
    expect(container).toHaveTextContent("Page 2");
    fireEvent.click(menuButton);
    expect(container).not.toHaveTextContent("Page 2");
  });

  it("clicking the overlay closes the menu", () => {
    const { container, getByRole, getByTestId } = render(
      <SideNavMobile labels={labelsValues} navItems={dummyNavItems} />,
    );
    const menuButton = getByRole("button");
    expect(container).not.toHaveTextContent("Page 2");
    fireEvent.click(menuButton);
    expect(container).toHaveTextContent("Page 2");
    const overlay = getByTestId("close-overlay");
    expect(overlay).toHaveClass("bg-black");
    fireEvent.click(overlay);
    expect(container).not.toHaveTextContent("Page 2");
  });

  it("renders the main menu toggle with correct aria-label and text", () => {
    const { getByRole } = render(
      <SideNavMobile
        labels={labelsValues}
        navItems={dummyNavItems}
        className="test-class"
      />,
    );
    const toggleLabel = getByRole("button");
    expect(toggleLabel).toBeInTheDocument();
    expect(toggleLabel).toHaveTextContent("Menu:");
    expect(toggleLabel).toHaveTextContent("Page 1");
  });
});
