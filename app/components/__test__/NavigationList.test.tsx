import { render, screen } from "@testing-library/react";
import { NavState } from "~/services/navigation/navState";
import { NavigationList } from "../navigation/NavigationList";

describe("NavigationList", () => {
  it("renders a <ul> element with one navigation item", () => {
    const destination = "/destination";
    const label = "navLabel";
    const state = NavState.Current;

    render(<NavigationList navItems={[{ destination, label, state }]} />);

    const links = screen.getAllByRole<HTMLAnchorElement>("link");
    expect(links[0]).toHaveTextContent(label);
    expect(links[0].href).toContain(destination);
    expect(links[0].parentNode).toBeInstanceOf(HTMLLIElement);
  });
});
