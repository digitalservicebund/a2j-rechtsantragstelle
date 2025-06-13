import { render, fireEvent } from "@testing-library/react";
import { type NavState } from "~/services/navigation/navState";
import SideNavMobile from "../SideNavMobile";
import { type NavItem } from "../types";

const dummyNavItems: NavItem[] = [
  { destination: "/page1", label: "Page 1", state: "Current" as NavState },
  { destination: "/page2", label: "Page 2", state: "Open" as NavState },
];

describe("SideNavMobile", () => {
  it("clicking the menu opens the menu", () => {
    const { container, getByRole } = render(
      <SideNavMobile navItems={dummyNavItems} />,
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
      <SideNavMobile navItems={dummyNavItems} />,
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
      <SideNavMobile navItems={dummyNavItems} className="test-class" />,
    );
    const toggleLabel = getByRole("button");
    expect(toggleLabel).toBeInTheDocument();
    expect(toggleLabel).toHaveTextContent("Bereich:");
    expect(toggleLabel).toHaveTextContent("Page 1");
  });
});
