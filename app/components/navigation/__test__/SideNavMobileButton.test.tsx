import { type NavState } from "~/services/navigation/navState";
import { type NavItem } from "../types";
import { render, fireEvent } from "@testing-library/react";
import { SideNavMobileButton } from "../SideNavMobileButton";

describe("SideNavMobileButton", () => {
  it("should render the description of the current and next nav item", () => {
    const dummyNavItems: NavItem[] = [
      { destination: "/page1", label: "Page 1", state: "Current" as NavState },
      { destination: "/page2", label: "Page 2", state: "Open" as NavState },
      { destination: "/page3", label: "Page 3", state: "Open" as NavState },
    ];

    const { container, getByTestId } = render(
      <SideNavMobileButton
        navItems={dummyNavItems}
        menuOpen
        toggleMenu={vi.fn()}
      />,
    );

    expect(container).toHaveTextContent("Page 1");
    expect(getByTestId("next-nav-item")).toHaveTextContent("Page 2");
  });

  it("should not render the next nav item if the current is the last one", () => {
    const dummyNavItems: NavItem[] = [
      { destination: "/page1", label: "Page 1", state: "Done" as NavState },
      { destination: "/page2", label: "Page 2", state: "Done" as NavState },
      { destination: "/page3", label: "Page 3", state: "Current" as NavState },
    ];

    const { queryByTestId } = render(
      <SideNavMobileButton
        navItems={dummyNavItems}
        menuOpen
        toggleMenu={vi.fn()}
      />,
    );

    expect(queryByTestId("next-nav-item")).not.toBeInTheDocument();
  });

  it("should render icon arrow up and button with aria-expanded true if menu is opened", () => {
    const { getByTestId, getByRole } = render(
      <SideNavMobileButton navItems={[]} menuOpen toggleMenu={vi.fn()} />,
    );

    expect(getByTestId("KeyboardArrowUpIcon")).toBeInTheDocument();
    expect(getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("should render icon arrow down and button with aria-expanded false if menu is not opened", () => {
    const { getByTestId, getByRole } = render(
      <SideNavMobileButton
        navItems={[]}
        menuOpen={false}
        toggleMenu={vi.fn()}
      />,
    );

    expect(getByTestId("KeyboardArrowDownIcon")).toBeInTheDocument();
    expect(getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("should call the toggleMenu when the button is clicked", () => {
    const mockToggleMenu = vi.fn();

    const { getByRole } = render(
      <SideNavMobileButton
        navItems={[]}
        menuOpen
        toggleMenu={mockToggleMenu}
      />,
    );

    const menuButton = getByRole("button");
    fireEvent.click(menuButton);
    expect(mockToggleMenu).toBeCalledTimes(1);
  });
});
