import { render, screen } from "@testing-library/react";
import type { NavItem } from "~/components/navigation/NavItem";
import { NavState } from "~/services/navigation/navState";
import SideNavMobile from "../SideNavMobile";

const dummyNavItems: NavItem[] = [
  { destination: "/page1", label: "Page 1", state: NavState.Current },
];

describe("SideNavMobile", () => {
  beforeEach(() => {
    render(
      <SideNavMobile
        label="Menu"
        currentPageTitle="Home"
        navItems={dummyNavItems}
        className="test-class"
      />,
    );
  });

  it("renders the container with the provided className", () => {
    render(
      <SideNavMobile
        label="Menu"
        currentPageTitle="Home"
        navItems={dummyNavItems}
        className="test-class"
      />,
    );
    const wrapper = document.querySelector(".test-class");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders the hidden checkbox with id 'menu-toggle' and 'peer' class", () => {
    const checkbox = document.getElementById("menu-toggle") as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass("peer");
    expect(checkbox).toHaveClass("hidden");
  });

  it("renders the overlay label for closing the menu with correct aria-label and sr-only text", () => {
    const overlayLabel = screen.getByTestId("close-overlay");
    expect(overlayLabel).toBeInTheDocument();
    expect(overlayLabel.querySelector("span")).toHaveClass("sr-only");
    expect(overlayLabel.querySelector("span")?.textContent).toBe("Close menu");
    expect(overlayLabel).toHaveClass("bg-black");
    expect(overlayLabel).toHaveClass("h-screen");
    expect(overlayLabel).toHaveClass("opacity-70");
  });

  it("renders the MenuIcon and Close icon with correct classes", () => {
    const { container } = render(
      <SideNavMobile
        label="Menu"
        currentPageTitle="Home"
        navItems={dummyNavItems}
      />,
    );
    const menuIcon = container.querySelector(
      ".inline-flex.peer-checked\\:hidden",
    );
    expect(menuIcon).toBeInTheDocument();

    const closeIcon = container.querySelector(
      ".hidden.peer-checked\\:inline-flex",
    );
    expect(closeIcon).toBeInTheDocument();
  });

  it("renders the main menu toggle label with correct aria-label and text", () => {
    const toggleLabel = screen.getByLabelText("Main menu toggle");
    expect(toggleLabel).toBeInTheDocument();
    expect(toggleLabel).toHaveTextContent("Menu:");
    expect(toggleLabel).toHaveTextContent("Home");
  });

  it("renders the NavigationList container with expected classes and content", () => {
    const navContainer = document.querySelector(
      ".w-full.hidden.peer-checked\\:block.bg-white.pb-10",
    );
    expect(navContainer).toBeInTheDocument();
    expect(screen.getByText("Page 1")).toBeInTheDocument();
  });
});
