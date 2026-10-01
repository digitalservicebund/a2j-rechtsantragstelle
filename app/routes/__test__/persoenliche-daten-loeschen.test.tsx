import { screen, render, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";

// TODO - Check this test, it's failing due the vmThreads config on vite.config
// oxlint-disable-next-line vitest/no-disabled-tests
describe.skip("Persoenliche Daten", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render back button with value of root when no referrer", async () => {
    const { default: PersoenlicheDatenLoeschen } =
      await import("../persoenliche-daten-loeschen");

    const RouteStub = createRoutesStub([
      {
        path: "/",
        HydrateFallback: () => null,
        Component: PersoenlicheDatenLoeschen,
        loader() {
          return {
            meta: undefined,
            content: undefined,
            translations: {
              back: "mock back text",
              confirm: "mock confirm text",
            },
            backButton: "/",
          };
        },
      },
    ]);

    render(<RouteStub />);
    await waitFor(() => {
      const backButton = screen.getByText("mock back text");
      expect(backButton).toBeInTheDocument();
      expect(backButton.parentElement?.getAttribute("href")).toStrictEqual("/");
    });
  });
});
