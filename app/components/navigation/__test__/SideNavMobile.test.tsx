import { render, fireEvent, waitFor } from "@testing-library/react";
import { type NavState } from "~/services/navigation/navState";
import SideNavMobile from "../SideNavMobile";
import { type NavItem } from "../types";
import { translations } from "~/services/translations/translations";

const dummyNavItems: NavItem[] = [
  { destination: "/page1", label: "Page 1", state: "Current" as NavState },
  { destination: "/page2", label: "Page 2", state: "Open" as NavState },
  { destination: "/page3", label: "Page 3", state: "Open" as NavState },
];

const dummyStepsStepper = [
  {
    href: ".",
    label: "Step 1",
    state: "Done" as NavState,
  },
  {
    href: "..",
    label: "Step 2",
    state: "Open" as NavState,
  },
  {
    href: "...",
    label: "Step 3",
    state: "Warning" as NavState,
  },
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

  it("should focus in the first nav item when click in the menu button", async () => {
    const { getByLabelText, container } = render(
      <SideNavMobile navItems={dummyNavItems} stepsStepper={[]} />,
    );
    const toggleElement = getByLabelText(
      translations.navigationMobile.toggleMenu.de,
    );
    fireEvent.click(toggleElement);
    const firstAnchorElement = container.querySelector(
      `a[href="${dummyNavItems[0].destination}"]`,
    );

    await waitFor(() => {
      expect(firstAnchorElement).toHaveFocus();
    });
  });

  it("should render the step stepper links correctly", () => {
    const { getAllByTestId } = render(
      <SideNavMobile
        navItems={dummyNavItems}
        stepsStepper={dummyStepsStepper}
      />,
    );

    expect(getAllByTestId("step-stepper-link").length).toBe(3);
    expect(getAllByTestId("step-stepper-link")[0]).toHaveTextContent("Step 1");
    expect(getAllByTestId("step-stepper-link")[1]).toHaveTextContent("Step 2");
    expect(getAllByTestId("step-stepper-link")[2]).toHaveTextContent("Step 3");
  });

  it("should add warning icon for step stepper with warning state and the a11y info", () => {
    const stepStepperWithWarning = [{ ...dummyStepsStepper[2] }];

    const { getByTestId } = render(
      <SideNavMobile
        navItems={dummyNavItems}
        stepsStepper={stepStepperWithWarning}
      />,
    );

    expect(getByTestId("icon-warning")).toBeInTheDocument();
    expect(getByTestId("icon-warning")).toHaveAttribute(
      "aria-label",
      "Warnhinweis",
    );
  });

  it("should focus in the summary after leave the last link", async () => {
    const { getByTestId, getAllByTestId } = render(
      <SideNavMobile navItems={dummyNavItems} stepsStepper={[]} />,
    );
    const summaryElement = getByTestId("side-nav-summary");
    //Open toggle
    fireEvent.click(summaryElement);

    const lastAnchorElement = getAllByTestId("nav-item-link")[2];

    fireEvent.keyDown(lastAnchorElement, { key: "Tab", shiftKey: false });

    await waitFor(() => {
      expect(summaryElement).toHaveFocus();
    });
  });

  it("should focus in the summary after leave the last steps stepper link", async () => {
    const { getByTestId, getAllByTestId } = render(
      <SideNavMobile
        navItems={dummyNavItems}
        stepsStepper={dummyStepsStepper}
      />,
    );
    const summaryElement = getByTestId("side-nav-summary");
    //Open toggle
    fireEvent.click(summaryElement);

    const lastStepStepperAnchorElement = getAllByTestId("step-stepper-link")[2];

    fireEvent.keyDown(lastStepStepperAnchorElement, {
      key: "Tab",
      shiftKey: false,
    });

    await waitFor(() => {
      expect(summaryElement).toHaveFocus();
    });
  });
});
