import { render, screen } from "@testing-library/react";
import type { NavItem } from "~/components/navigation/NavItem";
import { NavState } from "~/services/navigation/navState";
import SideNavMobile from "../SideNavMobile";

const dummyNavItems: NavItem[] = [
  { destination: "/page1", label: "Page 1", state: NavState.Current },
];

describe("SideNavMobile", () => {
  it("renders the container with the provided className", () => {
    render(
      <SideNavMobile
        label="Menu"
        navItems={dummyNavItems}
        className="test-class"
      />,
    );
    const wrapper = document.querySelector(".test-class");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders the hidden checkbox with id 'menu-toggle' and 'peer' class", () => {
    render(
      <SideNavMobile
        label="Menu"
        navItems={dummyNavItems}
        className="test-class"
      />,
    );
    const checkbox = document.getElementById("menu-toggle") as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    // expect(checkbox).toHaveClass("peer");
    expect(checkbox).toHaveClass("hidden");
  });

  it("renders the overlay label for closing the menu with correct aria-label and sr-only text", () => {
    render(
      <SideNavMobile
        label="Menu"
        navItems={dummyNavItems}
        className="test-class"
      />,
    );
    const overlayLabel = screen.getByTestId("close-overlay");
    expect(overlayLabel).toBeInTheDocument();
    expect(overlayLabel.querySelector("span")).toHaveClass("sr-only");
    expect(overlayLabel.querySelector("span")?.textContent).toBe("Close menu");
    expect(overlayLabel).toHaveClass("bg-black");
    expect(overlayLabel).toHaveClass("h-screen");
    expect(overlayLabel).toHaveClass("opacity-70");
  });

  it("renders the main menu toggle label with correct aria-label and text", () => {
    render(
      <SideNavMobile
        label="Menu"
        navItems={dummyNavItems}
        className="test-class"
      />,
    );
    const toggleLabel = screen.getByLabelText("Main menu toggle");
    expect(toggleLabel).toBeInTheDocument();
    expect(toggleLabel).toHaveTextContent("Menu:");
    expect(toggleLabel).toHaveTextContent("Page 1");
  });
});
