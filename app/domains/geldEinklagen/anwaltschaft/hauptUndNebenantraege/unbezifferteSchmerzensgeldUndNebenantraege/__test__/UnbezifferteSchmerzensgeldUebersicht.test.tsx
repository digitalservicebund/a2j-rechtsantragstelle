import { act, fireEvent, render, screen } from "@testing-library/react";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import type { FlowId } from "~/domains/flowIds";
import type { GeldEinklagenAnwaltschaftUserData } from "../../../userData";
import { translations } from "~/services/translations/translations";
import { ANTRAG_DELETION_URL_ENDPOINT } from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";
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

const person = {
  anrede: "frau",
  titel: "",
  vorname: "Erika",
  nachname: "Musterfrau",
  strasse: "Musterstraße",
  hausnummer: "1",
  plz: "12345",
  ort: "Musterstadt",
  land: "Deutschland",
  type: "natuerliche-person",
} as const;

const claimParties = {
  klagenden: [
    { ...person, parteiverhaeltnis: "klagende", "gesetzliche-vertretung": [] },
  ],
  beklagten: [
    { ...person, parteiverhaeltnis: "beklagte", "gesetzliche-vertretung": [] },
  ],
} satisfies Pick<GeldEinklagenAnwaltschaftUserData, "klagenden" | "beklagten">;

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
  it.each([0, 29])(
    "focuses the newly added claim after returning, starting with %i claims",
    (count) => {
      vi.useFakeTimers();
      const items = Array.from({ length: count }, () => antrag);
      const { unmount } = renderOverview({
        ...claimParties,
        schmerzengeldantrag: items,
      });
      act(() => vi.runAllTimers());

      const addLink = screen.getByTestId("add-schmerzengeldantrag");
      addLink.addEventListener("click", (event) => event.preventDefault());
      fireEvent.click(addLink);
      unmount();

      renderOverview({
        ...claimParties,
        schmerzengeldantrag: [...items, antrag],
      });
      act(() => vi.runAllTimers());

      expect(
        document.getElementById(`schmerzengeldantrag-${count}`),
      ).toHaveFocus();
      expect(sessionStorage.getItem("focus-schmerzengeldantrag")).toBeNull();
    },
  );

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
      translations.geldEinklagenAnwaltschaft.schmerzensgeldantrag.de;
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
      ANTRAG_DELETION_URL_ENDPOINT,
    );
  });

  it.each(["klagenden", "beklagten"] as const)(
    "should disable adding a claim and show the warning when %s are missing",
    (missingParty) => {
      renderOverview({ ...claimParties, [missingParty]: [] });

      const addLink = screen.getByTestId("add-schmerzengeldantrag");
      expect(addLink).toHaveAttribute("aria-disabled", "true");
      expect(addLink).not.toHaveAttribute("href");
      expect(
        screen.getByText(
          translations.geldEinklagenAnwaltschaft
            .zahlungsAntragInlineNoticeMissingPartiesTitle.de,
        ),
      ).toBeInTheDocument();
    },
  );

  it.each([29, 30])(
    "should enforce the 30 antrag limit at %i claims",
    (count) => {
      renderOverview({
        ...claimParties,
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
    const { rerender } = renderOverview({
      ...claimParties,
      schmerzengeldantrag: [antrag],
    });
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
      userData: claimParties,
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
