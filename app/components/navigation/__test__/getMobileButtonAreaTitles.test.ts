import { type NavState } from "~/services/navigation/navState";
import { type NavItem } from "../types";
import { getMobileButtonAreaTitles } from "../getMobileButtonAreaTitles";

describe("getMobileButtonAreaTitles", () => {
  it("should return the navigation items title in case stepsStepper is empty", () => {
    const dummyNavItems: NavItem[] = [
      { destination: "/page1", label: "Page 1", state: "Current" as NavState },
      { destination: "/page2", label: "Page 2", state: "Open" as NavState },
      { destination: "/page3", label: "Page 3", state: "Open" as NavState },
    ];

    const actual = getMobileButtonAreaTitles(dummyNavItems, []);
    expect(actual.currentAreaTitle).toEqual("Page 1");
    expect(actual.nextAreaTitle).toEqual("Page 2");
  });

  it("should return empty the nextAreaTitle of the navigation item in case last nav item is current ", () => {
    const dummyNavItems: NavItem[] = [
      { destination: "/page1", label: "Page 1", state: "Done" as NavState },
      { destination: "/page2", label: "Page 2", state: "Done" as NavState },
      { destination: "/page3", label: "Page 3", state: "Current" as NavState },
    ];

    const actual = getMobileButtonAreaTitles(dummyNavItems, []);
    expect(actual.currentAreaTitle).toEqual("Page 3");
    expect(actual.nextAreaTitle).toEqual("");
  });

  it("should return all empty if it does not have current state", () => {
    const dummyNavItems: NavItem[] = [
      { destination: "/page1", label: "Page 1", state: "Done" as NavState },
      { destination: "/page2", label: "Page 2", state: "Done" as NavState },
      { destination: "/page3", label: "Page 3", state: "Done" as NavState },
    ];

    const actual = getMobileButtonAreaTitles(dummyNavItems, []);
    expect(actual.currentAreaTitle).toEqual("");
    expect(actual.nextAreaTitle).toEqual("");
  });

  it("should return the titles and stepStepperIndex for the steps stepper", () => {
    const dummyNavItems: NavItem[] = [
      { destination: "/page1", label: "Page 1", state: "Current" as NavState },
      { destination: "/page2", label: "Page 2", state: "Open" as NavState },
      { destination: "/page3", label: "Page 3", state: "Open" as NavState },
    ];

    const dummyStepsStepper = [
      {
        href: ".",
        label: "Step 1",
        state: "Current" as NavState,
      },
      {
        href: ".",
        label: "Step 2",
        state: "Open" as NavState,
      },
      {
        href: ".",
        label: "Step 3",
        state: "Disabled" as NavState,
      },
    ];

    const actual = getMobileButtonAreaTitles(dummyNavItems, dummyStepsStepper);
    expect(actual.currentAreaTitle).toEqual("Step 1 (1/3)");
    expect(actual.nextAreaTitle).toEqual("Step 2 (2/3)");
  });

  it("should return empty the nextAreaTitle in case the last step stepper is the current one", () => {
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
        href: ".",
        label: "Step 2",
        state: "Done" as NavState,
      },
      {
        href: ".",
        label: "Step 3",
        state: "Current" as NavState,
      },
    ];

    const actual = getMobileButtonAreaTitles(dummyNavItems, dummyStepsStepper);
    expect(actual.currentAreaTitle).toEqual("Step 3 (3/3)");
    expect(actual.nextAreaTitle).toEqual("");
  });

  it("should return all empty in case does not have any current step stepper", () => {
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
        href: ".",
        label: "Step 2",
        state: "Done" as NavState,
      },
      {
        href: ".",
        label: "Step 3",
        state: "Done" as NavState,
      },
    ];

    const actual = getMobileButtonAreaTitles(dummyNavItems, dummyStepsStepper);
    expect(actual.currentAreaTitle).toEqual("");
    expect(actual.nextAreaTitle).toEqual("");
  });
});
