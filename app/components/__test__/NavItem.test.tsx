import { render, screen } from "@testing-library/react";
import { NavState } from "~/services/navigation/navState";
import { NavItem } from "../navigation/NavItem";

describe("NavigationItem", () => {
  const destination = "/destination";
  const label = "navLabel";

  it("renders one navigation item", () => {
    render(
      <NavItem
        destination={destination}
        label={label}
        state={NavState.Current}
      />,
    );

    expect(screen.getByRole("link")).toHaveTextContent(label);
    expect(screen.getByRole("link")).toHaveAttribute("href", destination);
    expect(screen.getByRole("listitem")).toBeInstanceOf(HTMLLIElement);
  });
  it("renders navigation item with a checkmark icon when state is done", () => {
    render(
      <NavItem destination={destination} label={label} state={NavState.Done} />,
    );

    const checkCircle = screen.getByTestId("CheckCircleIcon");
    expect(checkCircle).toHaveClass("shrink-0 fill-green-700");
  });

  it("renders navigation item with the correct classNames when state is disabled", () => {
    render(
      <NavItem
        destination={destination}
        label={label}
        state={NavState.Disabled}
      />,
    );

    screen
      .getAllByRole<HTMLAnchorElement>("link")
      .forEach((link) => expect(link).toHaveAttribute("aria-disabled", "true"));
    expect(screen.getByRole("listitem")).toHaveClass(
      "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none",
    );
  });

  it("renders navigation item with correct classNames when state is current", () => {
    render(
      <NavItem
        destination={destination}
        label={label}
        state={NavState.Current}
      />,
    );

    expect(screen.getByRole("listitem")).toHaveClass(
      "border-b-[1px] border-blue-400 last:border-0 min-w-full",
    );
  });

  it("renders navigation item with correct classNames when isChild is true", () => {
    render(
      <NavItem
        destination={destination}
        label={label}
        state={NavState.Current}
        isChild={true}
      />,
    );

    expect(screen.getByRole("listitem")).toHaveClass(
      "border-transparent last:border-transparent",
    );
  });

  it("renders navigation item with active subflows", () => {
    const subflows = [
      {
        destination: "/subflow1",
        label: "subflowLabel1",
        state: NavState.Current,
      },
      {
        destination: "/subflow2",
        label: "subflowLabel2",
        state: NavState.Disabled,
      },
    ];
    render(
      <NavItem
        destination={destination}
        label={label}
        state={NavState.Done}
        subflows={subflows}
      />,
    );

    const subflowLink = screen.getAllByRole("link");
    expect(subflowLink[0]).toHaveTextContent("subflowLabel1");
    expect(subflowLink[0]).toHaveAttribute("href", "/subflow1");
    expect(subflowLink).toHaveLength(1); // check that disabled subflow is not rendered
    expect(subflowLink[0].parentNode).toBeInstanceOf(HTMLLIElement);
  });

  it("renders subItem with correct classNames when isChild is true", () => {
    const subflows = [
      {
        destination: "/subflow",
        label: "subflowLabel",
        state: NavState.Open,
      },
    ];
    render(
      <NavItem
        destination={destination}
        label={label}
        state={NavState.Current}
        subflows={subflows}
      />,
    );
    expect(screen.getByText("subflowLabel")).toHaveClass("pl-24");
  });

  it("renders items with correct classNames when the state is current and item doesn't have subflows", () => {
    render(
      <NavItem
        destination={destination}
        label={label}
        state={NavState.Current}
      />,
    );
    expect(screen.getByRole("link")).toHaveClass(
      "ds-label-02-bold bg-blue-400",
    );
  });
});
