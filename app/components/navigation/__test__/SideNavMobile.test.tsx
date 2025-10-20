import { render, fireEvent, waitFor } from "@testing-library/react";
import { type NavState } from "~/services/navigation/navState";
import SideNavMobile from "../SideNavMobile";
import { type NavItem } from "../types";

const dummyNavItems: NavItem[] = [
  { destination: "/page1", label: "Page 1", state: "Current" as NavState },
  { destination: "/page2", label: "Page 2", state: "Open" as NavState },
  { destination: "/page3", label: "Page 3", state: "Open" as NavState },
];

describe("SideNavMobile", () => {
  it("clicking the menu opens the menu", () => {
    const { container, getByRole } = render(
      <SideNavMobile navItems={dummyNavItems} />,
    );

    const menuButton = getByRole("button");
    expect(container).not.toHaveTextContent("Page 3");
    fireEvent.click(menuButton);
    expect(container).toHaveTextContent("Page 3");
    fireEvent.click(menuButton);
    expect(container).not.toHaveTextContent("Page 3");
  });

  it("clicking the overlay closes the menu", () => {
    const { container, getByRole, getByTestId } = render(
      <SideNavMobile navItems={dummyNavItems} />,
    );
    const menuButton = getByRole("button");
    expect(container).not.toHaveTextContent("Page 3");
    fireEvent.click(menuButton);
    expect(container).toHaveTextContent("Page 3");
    const overlay = getByTestId("close-overlay");
    expect(overlay).toHaveClass("bg-black");
    fireEvent.click(overlay);
    expect(container).not.toHaveTextContent("Page 3");
  });

  it("renders the main menu toggle with correct aria-label and text", () => {
    const { getByRole } = render(<SideNavMobile navItems={dummyNavItems} />);
    const toggleLabel = getByRole("button");
    expect(toggleLabel).toBeInTheDocument();
    expect(toggleLabel).toHaveTextContent("Bereich:");
    expect(toggleLabel).toHaveTextContent("Page 1");
  });

  it("renders the aria-expanded with the correct value", () => {
    const { getByRole } = render(<SideNavMobile navItems={dummyNavItems} />);
    const menuButton = getByRole("button");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });

  it("should focus in the first nav item when click in the menu button", async () => {
    const { getByRole, container } = render(
      <SideNavMobile navItems={dummyNavItems} />,
    );
    const menuButton = getByRole("button");
    fireEvent.click(menuButton);
    const firstAnchorElement = container.querySelector(
      `a[href="${dummyNavItems[0].destination}"]`,
    );

    await waitFor(() => {
      expect(firstAnchorElement).toHaveFocus();
    });
  });
});
