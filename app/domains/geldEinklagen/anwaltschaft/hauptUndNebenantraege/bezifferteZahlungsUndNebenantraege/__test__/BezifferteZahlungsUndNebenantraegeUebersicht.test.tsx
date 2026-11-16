import { fireEvent, render, screen } from "@testing-library/react";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import type { FlowId } from "~/domains/flowIds";
import type { GeldEinklagenAnwaltschaftUserData } from "../../../userData";
import { translations } from "~/services/translations/translations";
import BezifferteZahlungsUndNebenantraegeUebersicht from "../BezifferteZahlungsUndNebenantraegeUebersicht";

vi.mock("~/components/hooks/formFlowContext", () => ({
  useFormFlow: vi.fn(),
}));
vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(),
}));

const antrag = {
  internesSchlagwortForderung: "Lohn",
  betragForderung: "1000",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "", year: "" },
  zinsende: { day: "", month: "", year: "" },
} as const;

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
  return render(<BezifferteZahlungsUndNebenantraegeUebersicht />);
};

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
  vi.mocked(useDeleteArrayItem).mockReturnValue(
    vi.fn().mockResolvedValue(undefined),
  );
});

afterEach(() => {
  sessionStorage.clear();
});

describe("BezifferteZahlungsUndNebenantraegeUebersicht", () => {
  it("should render a bezifferterantrag with edit link", () => {
    renderOverview({
      hauptantrag: [
        antrag,
        {
          ...antrag,
          internesSchlagwortForderung: "Internes Schlagwort Forderung Example",
        },
      ],
    });
    const headline =
      translations.geldEinklagenAnwaltschaft.bezifferterZahlungsantragHeadline
        .de;
    expect(
      screen.getByRole("heading", { name: `${headline} 1` }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: `${headline} 2` }),
    ).toBeInTheDocument();
    const edit = screen.getByRole("link", {
      name: "Zahlungsantrag 2 bearbeiten",
    });
    edit.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(edit);
    expect(sessionStorage.getItem("focus-zahlungsantrag")).toBe("1");
    expect(useDeleteArrayItem).toHaveBeenCalledWith(
      "hauptantrag",
      "/geld-einklagen/anwaltschaft",
      expect.any(Function),
    );
  });

  it.each([49, 50])(
    "should enforce the 50 antrag limit at %i claims",
    (count) => {
      renderOverview({
        hauptantrag: Array.from({ length: count }, () => antrag),
      });
      expect(screen.getByTestId("add-zahlungsantrag")).toHaveAttribute(
        "aria-disabled",
        String(count >= 50),
      );
      const notice = screen.queryByText(
        translations.geldEinklagenAnwaltschaft
          .zahlungsAntragInlineNoticeMaxReachedTitle.de,
      );
      if (count >= 50) {
        expect(notice).toBeInTheDocument();
      } else {
        expect(notice).not.toBeInTheDocument();
      }
    },
  );
});
