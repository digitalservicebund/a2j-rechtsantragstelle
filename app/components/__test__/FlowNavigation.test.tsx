import { render, screen } from "@testing-library/react";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import { NavState } from "~/services/navigation/navState";

describe("FlowNavigation", () => {
  it("renders a <nav> element with a <NavigationList> component", () => {
    const navItems = [
      {
        destination: "/destination",
        label: "navLabel",
        state: NavState.Current,
      },
    ];

    render(<FlowNavigation navItems={navItems} />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("bg-white border-[1px] border-blue-400");

    const list = screen.getByRole("list");
    expect(list).toHaveClass("pl-0");
  });
});
