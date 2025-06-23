// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import {
  createRoutesFromElements,
  createMemoryRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import { vi } from "vitest";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";

vi.mock("~/components/reportProblem/ReportProblem", () => ({
  ReportProblem: () => <button>Problem melden</button>,
}));

describe("Kontopfaendung Wegweiser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render report problem component when flowId is /kontopfaendung/wegweiser", async () => {
    const routes = createRoutesFromElements(
      <Route
        path="/kontopfaendung/wegweiser"
        element={<ReportProblem />}
        loader={() => ({
          meta: undefined,
          content: undefined,
          translations: {},
          backButton: "",
          flowId: "/kontopfaendung/wegweiser",
        })}
      />,
    );
    const router = createMemoryRouter(routes, {
      initialEntries: ["/kontopfaendung/wegweiser"],
    });

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText("Problem melden")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Problem melden" }),
      ).not.toBeNull();
    });
  });

  it("should not render report problem component when flowId is not /kontopfaendung/wegweiser", () => {
    const routes = createRoutesFromElements(
      <Route
        path="/other-path"
        element={<ReportProblem />}
        loader={() => ({
          meta: undefined,
          content: undefined,
          translations: {},
          backButton: "",
          flowId: "/other-path",
        })}
      />,
    );
    const router = createMemoryRouter(routes, {
      initialEntries: ["/other-path"],
    });

    render(<RouterProvider router={router} />);
    expect(screen.queryByText("Problem melden")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Problem melden" })).toBeNull();
  });
});
