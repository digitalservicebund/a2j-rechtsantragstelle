// @vitest-environment jsdom
import { screen, render, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import PersoenlicheDatenLoeschen from "../persoenliche-daten-loeschen";

describe("Persoenliche Daten", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render back button with value of root when no referrer", async () => {
    const RouteStub = createRoutesStub([
      {
        path: "/",
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
