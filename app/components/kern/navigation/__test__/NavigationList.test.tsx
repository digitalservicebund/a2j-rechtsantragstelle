import { render, screen } from "@testing-library/react";
import { type NavState } from "~/services/navigation/navState";
import { NavigationList } from "../NavigationList";

vi.mock("react-router", () => ({
  useRouteLoaderData: vi.fn(),
}));

describe("NavigationList", () => {
  it("renders a navigation list with one navigation item", () => {
    const destination = "/destination";
    const label = "navLabel";
    const state = "Current" as NavState;

    render(<NavigationList navItems={[{ destination, label, state }]} />);

    const list = screen.getByRole("list");
    expect(list).toBeInstanceOf(HTMLUListElement);
    expect(list).toHaveClass("pl-0");

    const item = screen.getAllByRole<HTMLAnchorElement>("link");
    expect(item[0]).toHaveTextContent(label);
    expect(item[0].href).toContain(destination);
    expect(item[0].parentNode).toBeInstanceOf(HTMLLIElement);
  });

  it("should expand all subflows when expandAll=true", () => {
    const navItems = [
      {
        destination: "/destination",
        label: "navLabel",
        state: "Done" as NavState,
        subflows: [
          {
            destination: "/subflow",
            label: "subflowLabel",
            state: "Done" as NavState,
          },
        ],
      },
      {
        destination: "/destination2",
        label: "navLabel",
        state: "Open" as NavState,
        subflows: [
          {
            destination: "/subflow",
            label: "subflowLabel",
            state: "Open" as NavState,
          },
        ],
      },
      {
        destination: "/destination3",
        label: "navLabel",
        state: "Done" as NavState,
        subflows: [
          {
            destination: "/subflow",
            label: "subflowLabel",
            state: "Done" as NavState,
          },
        ],
      },
    ];
    render(<NavigationList navItems={navItems} expandAll={true} />);
    expect(screen.getAllByTestId("ExpandLessIcon")).toHaveLength(3);
  });
});
