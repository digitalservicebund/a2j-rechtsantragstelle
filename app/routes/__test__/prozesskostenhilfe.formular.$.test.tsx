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

describe("Prozesskostenhilfe Formular", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render report problem component when flowId is /prozesskostenhilfe/formular", async () => {
    const routes = createRoutesFromElements(
      <Route
        path="/prozesskostenhilfe/formular"
        element={<ReportProblem />}
        loader={() => ({
          meta: undefined,
          content: undefined,
          translations: {},
          backButton: "",
          flowId: "/prozesskostenhilfe/formular",
        })}
      />,
    );
    const router = createMemoryRouter(routes, {
      initialEntries: ["/prozesskostenhilfe/formular"],
    });

    render(<RouterProvider router={router} />);
    await waitFor(() =>
      expect(screen.getByText("Problem melden")).toBeInTheDocument(),
    );
  });

  it("should not render report problem component when flowId is not /prozesskostenhilfe/formular", () => {
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
