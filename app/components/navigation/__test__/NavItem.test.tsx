import { render, screen } from "@testing-library/react";
import { NavState } from "~/services/navigation/navState";
import { NavItem } from "../NavItem";

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

  it("renders navigation item with subflows", () => {
    const subflows = [
      {
        destination: "/subflow1",
        label: "subflowLabel1",
        state: NavState.Open,
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
        state={NavState.Current}
        subflows={subflows}
      />,
    );

    const subflow1 = screen.getByText("subflowLabel1");
    expect(subflow1).toHaveAttribute("href", "/subflow1");
    const subflow2 = screen.queryByText("subflowLabel2");
    expect(subflow2).not.toBeInTheDocument();
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

  it("should not render aria-describedby for the link given state isDone false", () => {
    const { getByRole } = render(
      <NavItem destination={destination} label={label} state={NavState.Open} />,
    );

    expect(getByRole("link")).toBeInTheDocument();
    expect(getByRole("link")).not.toHaveAttribute("aria-describedby");
  });

  it("should render aria-describedby for the link given state isDone true", () => {
    const { getByRole } = render(
      <NavItem destination={destination} label={label} state={NavState.Done} />,
    );

    expect(getByRole("link")).toBeInTheDocument();
    expect(getByRole("link")).toHaveAttribute("aria-describedby");
  });

  it("should not render aria-describedby for the button given state isDone false for subflows", () => {
    const subflows = [
      {
        destination: "/subflow",
        label: "subflowLabel",
        state: NavState.Open,
      },
    ];
    const { getByRole } = render(
      <NavItem
        destination={destination}
        label={label}
        state={NavState.Open}
        subflows={subflows}
      />,
    );

    expect(getByRole("button")).toBeInTheDocument();
    expect(getByRole("button")).not.toHaveAttribute("aria-describedby");
  });

  it("should render aria-describedby for the button given state isDone true for subflows", () => {
    const subflows = [
      {
        destination: "/subflow",
        label: "subflowLabel",
        state: NavState.Done,
      },
    ];
    const { getByRole } = render(
      <NavItem
        destination={destination}
        label={label}
        state={NavState.Done}
        subflows={subflows}
      />,
    );

    expect(getByRole("button")).toBeInTheDocument();
    expect(getByRole("button")).toHaveAttribute("aria-describedby");
  });
});
