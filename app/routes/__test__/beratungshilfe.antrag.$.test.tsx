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

describe("Beratungshilfe Antrag", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render report problem component when flowId is /beratungshilfe/antrag", async () => {
    const routes = createRoutesFromElements(
      <Route
        path="/beratungshilfe/antrag"
        element={<ReportProblem />}
        loader={() => ({
          meta: undefined,
          content: undefined,
          translations: {},
          backButton: "",
          flowId: "/beratungshilfe/antrag",
        })}
      />,
    );
    const router = createMemoryRouter(routes, {
      initialEntries: ["/beratungshilfe/antrag"],
    });

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText("Problem melden")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Problem melden" }),
      ).not.toBeNull();
    });
  });

  it("should not render report problem component when flowId is not /beratungshilfe/antrag", () => {
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
