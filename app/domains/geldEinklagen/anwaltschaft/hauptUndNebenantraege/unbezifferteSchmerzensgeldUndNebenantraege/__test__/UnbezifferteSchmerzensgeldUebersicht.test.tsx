import { act, fireEvent, render, screen } from "@testing-library/react";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import type { FlowId } from "~/domains/flowIds";
import type { GeldEinklagenAnwaltschaftUserData } from "../../../userData";
import { translations } from "~/services/translations/translations";
import UnbezifferteSchmerzensgeldUebersicht from "../UnbezifferteSchmerzensgeldUebersicht";

vi.mock("~/components/hooks/formFlowContext", () => ({
  useFormFlow: vi.fn(),
}));
vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(),
}));

const antrag = {
  internesSchlagwortForderung: "Unfall",
  mindestBetrag: "5000",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "", year: "" },
  zinsende: { day: "", month: "", year: "" },
};

const renderOverview = (
  userData: GeldEinklagenAnwaltschaftUserData,
  flowId: FlowId = "/geld-einklagen/anwaltschaft",
) => {
  vi.mocked(useFormFlow).mockReturnValue({
    userData,
    flowId,
    translations: {},
    validFlowPages: {},
  });
  return render(<UnbezifferteSchmerzensgeldUebersicht />);
};

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
  vi.mocked(useDeleteArrayItem).mockReturnValue(
    vi.fn().mockResolvedValue(undefined),
  );
});

afterEach(() => {
  vi.useRealTimers();
  sessionStorage.clear();
});

describe("UnbezifferteSchmerzensgeldUebersicht", () => {
  it("should render a schmerzensgeldantrag with edit link", () => {
    renderOverview({
      schmerzengeldantrag: [
        antrag,
        {
          ...antrag,
          internesSchlagwortForderung: "Internes Schlagwort Forderung Example",
        },
      ],
    });
    const headline =
      translations.geldEinklagenAnwaltschaft.schmerzengeldantragHeadline.de;
    expect(
      screen.getByRole("heading", { name: `${headline} 1` }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: `${headline} 2` }),
    ).toBeInTheDocument();
    const edit = screen.getByRole("link", {
      name: "Schmerzensgeldantrag 2 bearbeiten",
    });
    edit.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(edit);
    expect(sessionStorage.getItem("focus-schmerzengeldantrag")).toBe("1");
    expect(useDeleteArrayItem).toHaveBeenCalledWith(
      "schmerzengeldantrag",
      "/geld-einklagen/anwaltschaft",
      expect.any(Function),
    );
  });

  it.each([29, 30])(
    "should enforce the 30 antrag limit at %i claims",
    (count) => {
      renderOverview({
        schmerzengeldantrag: Array.from({ length: count }, () => antrag),
      });
      expect(screen.getByTestId("add-schmerzengeldantrag")).toHaveAttribute(
        "aria-disabled",
        String(count >= 30),
      );
      const notice = screen.queryByText(
        translations.geldEinklagenAnwaltschaft
          .schmerzengeldantragInlineNoticeMaxReachedTitle.de,
      );
      if (count >= 30) {
        expect(notice).toBeInTheDocument();
      } else {
        expect(notice).not.toBeInTheDocument();
      }
    },
  );

  it("should restore focus after editing and deletion", () => {
    vi.useFakeTimers();
    sessionStorage.setItem("focus-schmerzengeldantrag", "0");
    const { rerender } = renderOverview({ schmerzengeldantrag: [antrag] });
    const item = document.getElementById("schmerzengeldantrag-0");
    act(() => vi.advanceTimersByTime(0));
    expect(item).toHaveFocus();
    expect(sessionStorage.getItem("focus-schmerzengeldantrag")).toBeNull();

    const focusAfterDelete = vi
      .mocked(useDeleteArrayItem)
      .mock.calls.find(([name]) => name === "schmerzengeldantrag")?.[2];
    expect(focusAfterDelete).toBeDefined();
    focusAfterDelete!(0);
    act(() => vi.advanceTimersByTime(100));
    expect(item).toHaveFocus();
    vi.mocked(useFormFlow).mockReturnValue({
      userData: {},
      flowId: "/geld-einklagen/anwaltschaft",
      translations: {},
      validFlowPages: {},
    });
    rerender(<UnbezifferteSchmerzensgeldUebersicht />);
    focusAfterDelete!(0);
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByTestId("add-schmerzengeldantrag")).toHaveFocus();
  });
});
