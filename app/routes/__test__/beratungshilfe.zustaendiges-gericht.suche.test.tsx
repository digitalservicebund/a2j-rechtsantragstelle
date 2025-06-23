// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { vi } from "vitest";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";

vi.mock("~/components/reportProblem/ReportProblem", () => ({
  ReportProblem: () => <button>Problem melden</button>,
}));

describe("Beratungshilfe Zuständiges Gericht Suche", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render report problem component", async () => {
    const RouteStub = createRoutesStub([
      {
        path: "/",
        Component: ReportProblem,
        loader() {
          return {
            meta: undefined,
            content: undefined,
            translations: {},
            backButton: "",
          };
        },
      },
    ]);
    render(<RouteStub />);
    await waitFor(() => {
      expect(screen.getByText("Problem melden")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Problem melden" }),
      ).not.toBeNull();
    });
  });
});
