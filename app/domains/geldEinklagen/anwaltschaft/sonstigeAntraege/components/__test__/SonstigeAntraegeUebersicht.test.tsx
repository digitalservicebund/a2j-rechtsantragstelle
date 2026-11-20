import { act, fireEvent, render, screen } from "@testing-library/react";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import type { GeldEinklagenAnwaltschaftUserData } from "../../../userData";
import SonstigeAntraegeUebersicht from "../SonstigeAntraegeUebersicht";

vi.mock("~/components/hooks/formFlowContext", () => ({
  useFormFlow: vi.fn(),
}));
vi.mock("~/components/hooks/useDeleteArrayItem");

const renderOverview = (
  sonstigeAntraege: GeldEinklagenAnwaltschaftUserData["sonstigeAntraege"] = [],
) => {
  vi.mocked(useFormFlow).mockReturnValue({
    userData: { sonstigeAntraege },
    flowId: "/geld-einklagen/anwaltschaft",
    translations: {},
    validFlowPages: {},
  });
  return render(<SonstigeAntraegeUebersicht />);
};

const clickWithoutNavigation = (element: HTMLElement) => {
  element.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  fireEvent.click(element);
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  sessionStorage.clear();
  vi.mocked(useDeleteArrayItem).mockReturnValue(
    vi.fn().mockResolvedValue(undefined),
  );
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  sessionStorage.clear();
});

describe("SonstigeAntraegeUebersicht focus", () => {
  it.each([0, 9])(
    "focuses the newly added item after returning, starting with %i items",
    (count) => {
      const items = Array.from({ length: count }, (_, index) => ({
        id: `antrag-${index}`,
        antrag: `Antrag ${index + 1}`,
      }));
      const { unmount } = renderOverview(items);
      act(() => vi.runAllTimers());

      clickWithoutNavigation(screen.getByTestId("add-sonstigeAntraege"));
      unmount();

      renderOverview([...items, { id: "new-antrag", antrag: "Neuer Antrag" }]);
      act(() => vi.runAllTimers());

      const addButton = screen.getByTestId("add-sonstigeAntraege");
      expect(
        document.getElementById(`sonstigeAntraege-${count}`),
      ).toHaveFocus();
      expect(addButton).not.toHaveFocus();
      expect(sessionStorage.getItem("focus-sonstigesantrag")).toBeNull();
      if (count === 9) {
        expect(addButton).toHaveAttribute("aria-disabled", "true");
        expect(addButton).not.toHaveAttribute("href");
      }
    },
  );

  it("preserves focus restoration to the edited item", () => {
    const items = [{ id: "antrag", antrag: "Mein Antrag" }];
    const { unmount } = renderOverview(items);
    act(() => vi.runAllTimers());

    clickWithoutNavigation(screen.getByRole("link", { name: /bearbeiten/i }));
    unmount();

    renderOverview(items);
    act(() => vi.runAllTimers());

    expect(document.getElementById("sonstigeAntraege-0")).toHaveFocus();
    expect(sessionStorage.getItem("focus-sonstigesantrag")).toBeNull();
  });

  it("does not move focus on an ordinary visit", () => {
    renderOverview();
    act(() => vi.runAllTimers());

    expect(screen.getByTestId("add-sonstigeAntraege")).not.toHaveFocus();
  });

  it.each([true, false])(
    "preserves focus after deletion when another item exists: %s",
    (hasRemainingItem) => {
      renderOverview(
        hasRemainingItem ? [{ id: "antrag", antrag: "Mein Antrag" }] : [],
      );
      const focusAfterDeletion = vi.mocked(useDeleteArrayItem).mock.calls[0][2];

      act(() => {
        focusAfterDeletion?.(0);
        vi.runAllTimers();
      });

      const target = hasRemainingItem
        ? document.getElementById("sonstigeAntraege-0")
        : screen.getByTestId("add-sonstigeAntraege");
      expect(target).toHaveFocus();
    },
  );
});

it("routes other Antrag deletions through the action that also removes Vorträge", () => {
  renderOverview([{ id: "antrag", antrag: "Mein Antrag" }]);

  expect(useDeleteArrayItem).toHaveBeenCalledWith(
    "sonstigeAntraege",
    "/geld-einklagen/anwaltschaft/sonstige-antraege/antrag",
    expect.any(Function),
    "/action/geld-einklagen/anwaltschaft/delete-antrag",
  );
});
