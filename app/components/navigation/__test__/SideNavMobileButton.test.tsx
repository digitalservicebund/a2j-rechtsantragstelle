import { render, fireEvent } from "@testing-library/react";
import { SideNavMobileButton } from "../SideNavMobileButton";
import { getMobileButtonAreaTitles } from "../getMobileButtonAreaTitles";

vi.mock("../getMobileButtonAreaTitles");

describe("SideNavMobileButton", () => {
  it("should render the component correctly", () => {
    vi.mocked(getMobileButtonAreaTitles).mockReturnValue({
      currentAreaTitle: "currentAreaTitle",
      nextAreaTitle: "nextAreaTitle",
    });

    const { container } = render(
      <SideNavMobileButton navItems={[]} menuOpen toggleMenu={vi.fn()} />,
    );

    expect(container).toHaveTextContent("currentAreaTitle");
    expect(container).toHaveTextContent("nextAreaTitle");
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
