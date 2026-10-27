import { act, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type GeldEinklagenAnwaltschaftUserData } from "../../../../userData";
import { type KlageParteiVerhaeltnis } from "../../../klageParties/klagePartySchemas";
import {
  einzelkanzlei,
  gesellschaft,
  unrelatedParty,
} from "../../__test__/fixtures";
import { geldEinklagenAnwaltschaftExtras } from "../../../../geldEinklagenAnwaltschaftExtras";
import { getProzessbevollmaechtigteArrayName } from "../../prozessbevollmaechtigteHelpers";
import { focusOnProzessbevollmaechtigteTitle } from "../../prozessbevollmaechtigteFocus";
import { ProzessbevollmaechtigteUebersicht } from "../ProzessbevollmaechtigteUebersicht";

vi.mock("~/components/hooks/formFlowContext", () => ({
  useFormFlow: vi.fn(),
}));

const renderOverview = (
  userData: GeldEinklagenAnwaltschaftUserData,
  relationship: KlageParteiVerhaeltnis = "klagende",
) => {
  vi.mocked(useFormFlow).mockReturnValue({
    userData,
    flowId: "/geld-einklagen/anwaltschaft",
    translations: {},
    validFlowPages: {},
  });
  return render(
    <MemoryRouter>
      <ProzessbevollmaechtigteUebersicht relationship={relationship} />
    </MemoryRouter>,
  );
};

describe("ProzessbevollmaechtigteUebersicht", () => {
  it.each(["klagende", "beklagte"] as const)(
    "renders a single %s representative with correct edit URLs",
    (relationship) => {
      const arrayName = getProzessbevollmaechtigteArrayName(relationship);
      for (const item of [einzelkanzlei, gesellschaft]) {
        const { unmount } = renderOverview(
          {
            [arrayName]: [item],
            klagenden: [unrelatedParty],
            beklagten: [unrelatedParty],
          },
          relationship,
        );
        expect(screen.queryByText(/Wrong/)).not.toBeInTheDocument();
        expect(
          screen.getByText(
            item.type === "einzelkanzlei"
              ? "Frau Erika Musterfrau"
              : "Musterkanzlei PartG",
          ),
        ).toBeInTheDocument();
        expect(
          screen.queryByText(/Gesetzliche Vertretung/),
        ).not.toBeInTheDocument();
        const cards = screen.getAllByTestId("prozessbevollmaechtigte");
        expect(cards).toHaveLength(1);
        const edit = within(cards[0]).getByRole("link", {
          name: /bearbeiten/i,
        });
        expect(edit).toHaveAttribute(
          "id",
          `array-summary-item-edit-${arrayName}-0`,
        );
        expect(edit).toHaveAttribute(
          "href",
          `/geld-einklagen/anwaltschaft/${relationship}-partei/prozessbevollmaechtigte/0/${item.type}-daten`,
        );
        for (const type of ["einzelkanzlei", "berufsausuebungsgesellschaft"]) {
          expect(screen.getByTestId(`add-${type}`)).toHaveAttribute(
            "aria-disabled",
            "true",
          );
        }
        unmount();
      }
    },
  );

  it.each(["einzelkanzlei", "berufsausuebungsgesellschaft"] as const)(
    "disables both types when a %s already exists",
    (type) => {
      const item = type === "einzelkanzlei" ? einzelkanzlei : gesellschaft;
      const data = (count: number) => ({
        klagendeProzessbevollmaechtigte: Array.from(
          { length: count },
          () => item,
        ),
      });
      const { unmount } = renderOverview(data(1));
      expect(screen.getByTestId(`add-${type}`)).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      unmount();
      renderOverview(data(2));
      expect(screen.getByTestId(`add-${type}`)).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      const otherType =
        type === "einzelkanzlei"
          ? "berufsausuebungsgesellschaft"
          : "einzelkanzlei";
      expect(screen.getByTestId(`add-${otherType}`)).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    },
  );

  it("starts both add links at zero for missing representative data", () => {
    renderOverview({});
    expect(screen.queryAllByTestId("prozessbevollmaechtigte")).toHaveLength(0);
    for (const type of ["einzelkanzlei", "berufsausuebungsgesellschaft"]) {
      expect(screen.getByTestId(`add-${type}`)).toHaveAttribute(
        "href",
        `/geld-einklagen/anwaltschaft/klagende-partei/prozessbevollmaechtigte/0/${type}-daten`,
      );
      expect(screen.getByTestId(`add-${type}`)).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }
  });

  it.each(["klagende", "beklagte"] as const)(
    "does not disable adding for %s when only the other side has an entry",
    (relationship) => {
      const otherRelationship =
        relationship === "klagende" ? "beklagte" : "klagende";
      renderOverview(
        {
          [getProzessbevollmaechtigteArrayName(otherRelationship)]: [
            einzelkanzlei,
          ],
        },
        relationship,
      );
      for (const type of ["einzelkanzlei", "berufsausuebungsgesellschaft"]) {
        expect(screen.getByTestId(`add-${type}`)).not.toHaveAttribute(
          "aria-disabled",
          "true",
        );
      }
    },
  );

  it("does not render in another flow", () => {
    vi.mocked(useFormFlow).mockReturnValue({
      userData: {},
      flowId: "/fluggastrechte/formular",
      translations: {},
      validFlowPages: {},
    });
    const { container } = render(
      <ProzessbevollmaechtigteUebersicht relationship="klagende" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it.each(["klagende", "beklagte"] as const)(
    "registers the %s overview as a flow extra",
    (relationship) => {
      expect(
        geldEinklagenAnwaltschaftExtras.renderExtraComponents?.({
          stepId: `/${relationship}-partei/prozessbevollmaechtigte/uebersicht`,
        }),
      ).toEqual(
        <ProzessbevollmaechtigteUebersicht relationship={relationship} />,
      );
    },
  );

  it("focuses an item heading, or its group heading when the item is absent", () => {
    vi.useFakeTimers();
    try {
      renderOverview({ klagendeProzessbevollmaechtigte: [einzelkanzlei] });
      act(() => {
        focusOnProzessbevollmaechtigteTitle("klagende", "einzelkanzlei", 0);
        vi.runAllTimers();
      });
      act(() => {
        focusOnProzessbevollmaechtigteTitle(
          "klagende",
          "berufsausuebungsgesellschaft",
          9,
        );
        vi.runAllTimers();
      });
      expect(
        screen.getByRole("heading", { name: "Berufsausübungsgesellschaft" }),
      ).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });
});
