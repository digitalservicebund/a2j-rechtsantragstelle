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

describe("Report Problem on Flow and Vorabcheck Pages", () => {
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
          shouldShowReportProblem: true,
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
  it("should render report problem component when flowId is /beratungshilfe/vorabcheck", async () => {
    const routes = createRoutesFromElements(
      <Route
        path="/beratungshilfe/vorabcheck"
        element={<ReportProblem />}
        loader={() => ({
          meta: undefined,
          content: undefined,
          translations: {},
          backButton: "",
          flowId: "/beratungshilfe/vorabcheck",
          shouldShowReportProblem: true,
        })}
      />,
    );
    const router = createMemoryRouter(routes, {
      initialEntries: ["/beratungshilfe/vorabcheck"],
    });

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText("Problem melden")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Problem melden" }),
      ).not.toBeNull();
    });
  });
  it("should render report problem component when flowId is /beratungshilfe/zustaendiges-gericht", async () => {
    const routes = createRoutesFromElements(
      <Route
        path="/beratungshilfe/zustaendiges-gericht"
        element={<ReportProblem />}
        loader={() => ({
          meta: undefined,
          content: undefined,
          translations: {},
          backButton: "",
          flowId: "/beratungshilfe/zustaendiges-gericht",
          shouldShowReportProblem: true,
        })}
      />,
    );
    const router = createMemoryRouter(routes, {
      initialEntries: ["/beratungshilfe/zustaendiges-gericht"],
    });

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText("Problem melden")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Problem melden" }),
      ).not.toBeNull();
    });
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
          shouldShowReportProblem: true,
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
          shouldShowReportProblem: true,
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
  it("should not render report problem component for other flowId", () => {
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
          shouldShowReportProblem: false,
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
