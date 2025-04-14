// @vitest-environment jsdom
import { screen, render, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import PersoenlicheDatenLoeschen from "../persoenliche-daten-loeschen";

vi.mock("~/components/PageContent", () => ({
  default: () => <div>PageContent</div>,
}));

describe("Persoenliche Daten", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render PageContent", async () => {
    const RemixStub = createRoutesStub([
      {
        path: "/",
        Component: PersoenlicheDatenLoeschen,
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

    render(<RemixStub />);
    await waitFor(() =>
      expect(screen.getByText("PageContent")).toBeInTheDocument(),
    );
  });

  it("should render back button with value of root when no referrer", async () => {
    const RemixStub = createRoutesStub([
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

    render(<RemixStub />);
    await waitFor(() => {
      const backButton = screen.getByText("mock back text");
      expect(backButton).toBeInTheDocument();
      expect(backButton.parentElement?.getAttribute("href")).toStrictEqual("/");
    });
  });
});
