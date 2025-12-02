import { render, fireEvent } from "@testing-library/react";
import { type NavState } from "~/services/navigation/navState";
import SideNavMobile from "../SideNavMobile";
import { type NavItem } from "../types";
import { translations } from "~/services/translations/translations";

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

  it("renders the main menu toggle with correct aria-label and text", () => {
    const { getByLabelText } = render(
      <SideNavMobile navItems={dummyNavItems} stepsStepper={[]} />,
    );
    const toggleLabel = getByLabelText(
      translations.navigationMobile.toggleMenu.de,
    );
    expect(toggleLabel).toBeInTheDocument();
    expect(toggleLabel).toHaveTextContent("Page 1");
  });
});
