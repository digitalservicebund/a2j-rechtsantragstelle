import { render, fireEvent, waitFor } from "@testing-library/react";
import { type NavState } from "~/services/navigation/navState";
import SideNavMobile from "../SideNavMobile";
import { type NavItem } from "../types";

// vi.mock("../getMobileButtonAreaTitles");

const dummyNavItems: NavItem[] = [
  { destination: "/page1", label: "Page 1", state: "Current" as NavState },
  { destination: "/page2", label: "Page 2", state: "Open" as NavState },
  { destination: "/page3", label: "Page 3", state: "Open" as NavState },
];

describe("SideNavMobile", () => {
  it("clicking the summary element opens the menu", () => {
    const { getByText, getByTestId } = render(
      <SideNavMobile navItems={dummyNavItems} stepsStepper={[]} />,
    );

    const summaryElement = getByText("Page 1", { selector: "span" });
    const detailsElement = getByTestId("side-nav-details");
    expect(summaryElement).toBeInTheDocument();
    expect(detailsElement).toBeInTheDocument();
    expect(detailsElement).not.toHaveProperty("open", true);
    fireEvent.click(summaryElement);
    expect(detailsElement).toHaveProperty("open", true);
  });

  it("clicking the overlay closes the menu", () => {
    const { getByText, getByTestId } = render(
      <SideNavMobile navItems={dummyNavItems} stepsStepper={[]} />,
    );
    const summaryElement = getByText("Page 1", { selector: "span" });
    const detailsElement = getByTestId("side-nav-details");
    expect(detailsElement).not.toHaveProperty("open", true);
    fireEvent.click(summaryElement);
    expect(detailsElement).toHaveProperty("open", true);
    const overlay = getByTestId("close-overlay");
    expect(overlay).toHaveClass("bg-black");
    fireEvent.click(overlay);
    expect(detailsElement).not.toHaveProperty("open", true);
  });

  it("should focus in the first nav item when click in the menu button", async () => {
    const { getByRole, container } = render(
      <SideNavMobile navItems={dummyNavItems} stepsStepper={[]} />,
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
