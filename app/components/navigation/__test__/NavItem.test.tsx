import { render, screen } from "@testing-library/react";
import { type NavState } from "~/services/navigation/navState";
import { translations } from "~/services/translations/translations";
import { NavItem } from "../NavItem";

describe("NavigationItem", () => {
  const destination = "/destination";
  const label = "navLabel";

  it("renders one navigation item", () => {
    render(
      <NavItem destination={destination} label={label} state={"Current"} />,
    );

    expect(screen.getByRole("link")).toHaveTextContent(label);
    expect(screen.getByRole("link")).toHaveAttribute("href", destination);
    expect(screen.getByRole("listitem")).toBeInstanceOf(HTMLLIElement);
  });

  it("renders navigation item with a checkmark icon when state is done", () => {
    render(<NavItem destination={destination} label={label} state={"Done"} />);

    const checkCircle = screen.getByTestId("icon-check-circle");
    expect(checkCircle).toHaveClass("fill-kern-feedback-success flex-shrink-0");
  });

  it("renders an incomplete navigation item with a warning icon when the state is warning", () => {
    const { getByTestId } = render(
      <NavItem destination={destination} label={label} state={"Warning"} />,
    );
    const warningIcon = getByTestId("icon-warning");
    expect(warningIcon).toBeInTheDocument();
    expect(warningIcon).toHaveAttribute(
      "aria-label",
      translations.navigation.navigationItemWarning.de,
    );
  });

  it("renders an incomplete navigation item with a warning icon when the state is warning current", () => {
    const { getByTestId } = render(
      <NavItem
        destination={destination}
        label={label}
        state={"WarningCurrent"}
      />,
    );
    const warningIcon = getByTestId("icon-warning");
    expect(warningIcon).toBeInTheDocument();
    expect(warningIcon).toHaveAttribute(
      "aria-label",
      translations.navigation.navigationItemWarning.de,
    );
  });

  it("renders navigation item with the correct classNames when state is disabled", () => {
    render(
      <NavItem destination={destination} label={label} state={"Disabled"} />,
    );

    screen
      .getAllByRole<HTMLAnchorElement>("link")
      .forEach((link) => expect(link).toHaveAttribute("aria-disabled", "true"));
    expect(screen.getByRole("listitem")).toHaveClass(
      "text-kern-neutral-400! cursor-not-allowed hover:font-normal pointer-events-none",
    );
  });

  it("renders navigation item with correct classNames when state is current", () => {
    render(
      <NavItem destination={destination} label={label} state={"Current"} />,
    );

    expect(screen.getByRole("listitem")).toHaveClass(
      "border-b border-kern-neutral-200 last:border-0",
    );
  });

  it("renders navigation item with correct classNames when isChild is true", () => {
    render(
      <NavItem
        destination={destination}
        label={label}
        state={"Current"}
        isChild={true}
      />,
    );

    expect(screen.getByRole("listitem")).toHaveClass(
      "border-kern-neutral-200 last:border-0 border-none",
    );
  });

  it("renders navigation item with subflows", () => {
    const subflows = [
      {
        destination: "/subflow1",
        label: "subflowLabel1",
        state: "Open" as NavState,
      },
      {
        destination: "/subflow2",
        label: "subflowLabel2",
        state: "Disabled" as NavState,
      },
    ];
    render(
      <NavItem
        destination={destination}
        label={label}
        state={"Current"}
        subflows={subflows}
      />,
    );

    const subflow1 = screen.getByRole("link", { name: "subflowLabel1" });
    expect(subflow1).toHaveAttribute("href", "/subflow1");
    const subflow2 = screen.queryByText("subflowLabel2");
    expect(subflow2).not.toBeInTheDocument();
  });

  it("renders subItem with correct classNames when isChild is true", () => {
    const subflows = [
      {
        destination: "/subflow",
        label: "subflowLabel",
        state: "Open" as NavState,
      },
    ];
    render(
      <NavItem
        destination={destination}
        label={label}
        state={"Current"}
        subflows={subflows}
      />,
    );
    expect(screen.getByText("subflowLabel").closest("a")).toHaveClass("pl-24!");
  });

  it("renders expanded when expanded is set", () => {
    const subflows = [
      {
        destination: "/subflow",
        label: "subflowLabel",
        state: "Done" as NavState,
      },
    ];
    render(
      <NavItem
        destination={destination}
        label={label}
        state={"Done"}
        forceExpanded={true}
        subflows={subflows}
      />,
    );
    expect(screen.getByTestId("icon-keyboard-arrow-up")).toBeInTheDocument();
  });

  it("renders items with correct classNames when the state is current and item doesn't have subflows", () => {
    render(
      <NavItem destination={destination} label={label} state={"Current"} />,
    );
    expect(screen.getByRole("link")).toHaveClass(" kern-body kern-body--small");
  });

  it("should not render aria-describedby for the link given state isDone false", () => {
    const { getByRole } = render(
      <NavItem destination={destination} label={label} state={"Open"} />,
    );

    expect(getByRole("link")).toBeInTheDocument();
    expect(getByRole("link")).not.toHaveAttribute("aria-describedby");
  });

  it("should render aria-describedby for the link given state isDone true", () => {
    const { getByRole } = render(
      <NavItem destination={destination} label={label} state={"Done"} />,
    );

    expect(getByRole("link")).toBeInTheDocument();
    expect(getByRole("link")).toHaveAttribute("aria-describedby");
  });

  it("should not render aria-describedby for the button given state isDone false for subflows", () => {
    const subflows = [
      {
        destination: "/subflow",
        label: "subflowLabel",
        state: "Open" as NavState,
      },
    ];
    const { getByRole } = render(
      <NavItem
        destination={destination}
        label={label}
        state={"Open"}
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
        state: "Done" as NavState,
      },
    ];
    const { getByRole } = render(
      <NavItem
        destination={destination}
        label={label}
        state={"Done"}
        subflows={subflows}
      />,
    );

    expect(getByRole("button")).toBeInTheDocument();
    expect(getByRole("button")).toHaveAttribute("aria-describedby");
  });
});
