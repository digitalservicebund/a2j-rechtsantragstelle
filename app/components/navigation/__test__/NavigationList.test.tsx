import { render, screen } from "@testing-library/react";
import { NavState } from "~/services/navigation/navState";
import { NavigationList } from "../NavigationList";

describe("NavigationList", () => {
  it("renders a navigation list with one navigation item", () => {
    const destination = "/destination";
    const label = "navLabel";
    const state = NavState.Current;

    render(<NavigationList navItems={[{ destination, label, state }]} />);

    const list = screen.getByRole("list");
    expect(list).toBeInstanceOf(HTMLUListElement);
    expect(list).toHaveClass("pl-0");

    const item = screen.getAllByRole<HTMLAnchorElement>("link");
    expect(item[0]).toHaveTextContent(label);
    expect(item[0].href).toContain(destination);
    expect(item[0].parentNode).toBeInstanceOf(HTMLLIElement);
  });
});
