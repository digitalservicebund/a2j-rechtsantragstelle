import {
  fireEvent,
  render,
  screen,
  type RenderResult,
} from "@testing-library/react";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import { NavState } from "~/services/navigation/navState";

describe("FlowNavigation", () => {
  let component: RenderResult;

  afterEach(() => {
    component.unmount();
  });

  it("renders single navigation item", () => {
    const destination = "/destination";
    const label = "navLabel";
    const state = NavState.Current;

    component = render(
      <FlowNavigation navItems={[{ destination, label, state }]} />,
    );

    const links = screen.getAllByRole<HTMLAnchorElement>("link");
    expect(links[0]).toHaveTextContent(label);
    expect(links[0].href).toContain(destination);
    expect(links[0].parentNode).toBeInstanceOf(HTMLLIElement);
  });

  it("renders disabled navigation item", () => {
    const label = "navLabel";
    component = render(
      <FlowNavigation
        navItems={[
          { destination: "/a", label, state: NavState.OpenDisabled },
          { destination: "/b", label, state: NavState.DoneDisabled },
        ]}
      />,
    );
    screen
      .getAllByRole<HTMLAnchorElement>("link")
      .forEach((link) => expect(link).toHaveAttribute("aria-disabled", "true"));
  });

  it("renders nested collapsible navigation", () => {
    const label = "navLabel";
    component = render(
      <FlowNavigation
        navItems={[
          {
            destination: "/a",
            label,
            state: NavState.Open,
            subflows: [
              { destination: "/c", label: "sublabel", state: NavState.Open },
            ],
          },
        ]}
      />,
    );

    const liElement = screen.getByRole<HTMLLIElement>("listitem");

    expect(liElement.children[1]).not.toBeVisible();
    fireEvent.click(liElement.children[0]);
    expect(liElement.children[1]).toBeVisible();
    expect(liElement.children[1]).toHaveTextContent("sublabel");
  });
});
