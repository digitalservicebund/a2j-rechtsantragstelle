import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type FlowId } from "~/domains/flowIds";
import {
  MAX_REPRESENTATIVES,
  type KlageParteien,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import {
  focusOnGesetzlicheVertretungTitle,
  focusOnKlageParteiTitle,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyFocus";
import { MAX_KLAGE_PARTIES } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/useKlageParties";
import { type UserData } from "~/domains/userData";
import { translations } from "~/services/translations/translations";
import { KlageParteienUebersicht } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/components/KlageParteienUebersicht";

vi.mock("~/components/hooks/formFlowContext", () => ({
  useFormFlow: vi.fn(),
}));

const naturalPerson = {
  type: "natuerliche-person",
  index: 1,
  parteiverhaeltnis: "klagende",
} as Partial<KlageParteien[number]>;

const organization = {
  type: "organisation",
  orgName: "Example Org",
  index: 2,
  parteiverhaeltnis: "klagende",
} as Partial<KlageParteien[number]>;

const renderOverview = (
  userData: UserData,
  relationship: KlageParteiVerhaeltnis = "klagende",
  flowId: FlowId = "/geld-einklagen/anwaltschaft",
) => {
  vi.mocked(useFormFlow).mockReturnValue({
    userData,
    flowId,
    translations: {},
    validFlowPages: {},
  });

  return render(
    <MemoryRouter>
      <KlageParteienUebersicht relationship={relationship} />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("KlageParteienUebersicht", () => {
  it.each(["klagende", "beklagte"] as const)(
    "numbers %s natural persons before organizations while preserving array indexes in routes",
    (relationship) => {
      renderOverview(
        {
          klagenden: [organization, naturalPerson],
          beklagten: [organization, naturalPerson],
        },
        relationship,
      );
      const arrayName = relationship === "klagende" ? "klagenden" : "beklagten";
      const partyHeadline =
        translations.geldEinklagenAnwaltschaft[
          relationship === "klagende"
            ? "klagendeParteiHeadline"
            : "beklagteParteiHeadline"
        ].de;

      for (const { number, arrayIndex, partyType } of [
        { number: 1, arrayIndex: 1, partyType: "natuerliche-person" },
        { number: 2, arrayIndex: 0, partyType: "organisation" },
      ]) {
        expect(
          screen.getByRole("link", {
            name: `${partyHeadline} ${number}) ${translations.arraySummary.arrayEditButtonLabel.de}`,
          }),
        ).toHaveAttribute(
          "id",
          `array-summary-item-edit-${arrayName}-${arrayIndex}`,
        );
        expect(
          screen.getByRole("link", {
            name: `${partyHeadline} ${number}) ${translations.arraySummary.arrayEditButtonLabel.de}`,
          }),
        ).toHaveAttribute(
          "href",
          `/geld-einklagen/anwaltschaft/${relationship}-partei/${arrayName}/${arrayIndex}/${partyType}-daten`,
        );
      }
    },
  );

  describe("focus management", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it.each(["klagende", "beklagte"] as const)(
      "focuses the %s party title after the rendering delay",
      (relationship) => {
        renderOverview(
          { klagenden: [naturalPerson], beklagten: [naturalPerson] },
          relationship,
        );
        const heading = screen.getByRole("heading", {
          name: `${translations.geldEinklagenAnwaltschaft[relationship === "klagende" ? "klagendeParteiHeadline" : "beklagteParteiHeadline"].de} 1)`,
        });

        focusOnKlageParteiTitle(relationship, "natuerliche-person", 0);
        act(() => vi.advanceTimersByTime(99));
        expect(heading).not.toHaveFocus();
        act(() => vi.advanceTimersByTime(1));
        expect(heading).toHaveFocus();
        expect(heading).toHaveAttribute("tabindex", "-1");
      },
    );

    it.each(["natuerliche-person", "organisation"] as const)(
      "falls back to the %s section when the party no longer exists",
      (partyType) => {
        renderOverview({});

        focusOnKlageParteiTitle("klagende", partyType, 0);
        act(() => vi.advanceTimersByTime(100));

        expect(
          screen.getByRole("heading", {
            name: translations.geldEinklagenAnwaltschaft[
              partyType === "organisation"
                ? "organisationenHeadline"
                : "natuerlichePersonenHeadline"
            ].de,
          }),
        ).toHaveFocus();
      },
    );

    it.each(["klagende", "beklagte"] as const)(
      "focuses the correct %s representative title, including an empty section",
      (relationship) => {
        renderOverview(
          {
            klagenden: [naturalPerson, organization],
            beklagten: [naturalPerson, organization],
          },
          relationship,
        );
        const headings = screen.getAllByRole("heading", { level: 4 });

        focusOnGesetzlicheVertretungTitle(relationship, 1);
        act(() => vi.advanceTimersByTime(99));
        expect(headings[1]).not.toHaveFocus();
        act(() => vi.advanceTimersByTime(1));
        expect(headings[1]).toHaveFocus();
        expect(headings[1]).toHaveAttribute("tabindex", "-1");
        expect(headings[0]).not.toHaveFocus();
      },
    );

    it("does not throw if the overview has unmounted before focus is restored", () => {
      const { unmount } = renderOverview({ klagenden: [naturalPerson] });
      focusOnKlageParteiTitle("klagende", "natuerliche-person", 0);
      focusOnGesetzlicheVertretungTitle("klagende", 0);
      unmount();

      expect(() => {
        act(() => vi.advanceTimersByTime(100));
      }).not.toThrow();
    });
  });

  it("links to the next representative from the overview below the natural-person limit", () => {
    renderOverview({
      klagenden: [
        {
          ...naturalPerson,
          "gesetzliche-vertretung": Array.from(
            { length: MAX_REPRESENTATIVES - 1 },
            () => ({ art: "elternteil" as const }),
          ),
        },
      ],
    });

    expect(
      screen.getByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`,
      }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/0/gesetzliche-vertretung/4/daten",
    );
  });

  it("does not offer a sixth representative for a natural person", () => {
    renderOverview({
      klagenden: [
        {
          ...naturalPerson,
          "gesetzliche-vertretung": Array.from(
            { length: MAX_REPRESENTATIVES },
            () => ({ art: "elternteil" as const }),
          ),
        },
      ],
    });

    expect(
      screen.queryByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`,
      }),
    ).not.toBeInTheDocument();
  });

  it("renders the flat organization representative and allows additional representatives", () => {
    renderOverview({
      klagenden: [
        {
          ...organization,
          orgVertretungArt: "vorstand-vorstaendin",
          orgVertretungAnrede: "herr",
          orgVertretungTitel: "",
          orgVertretungVorname: "Max",
          orgVertretungNachname: "Mustermann",
          "gesetzliche-vertretung": Array.from(
            { length: MAX_REPRESENTATIVES - 1 },
            () => ({
              art: "vorstand-vorstaendin" as const,
            }),
          ),
        },
      ],
    });

    expect(screen.getByText("Herr Max Mustermann")).toBeInTheDocument();
    expect(
      screen.getAllByText(
        translations.geldEinklagenAnwaltschaft.gesetzlicheVertretungArt.de,
        { exact: false },
      ),
    ).toHaveLength(MAX_REPRESENTATIVES);
    expect(
      screen.getByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`,
      }),
    ).toHaveAttribute(
      "href",
      `/geld-einklagen/anwaltschaft/klagende-partei/klagenden/0/gesetzliche-vertretung/${MAX_REPRESENTATIVES - 1}/daten-organisation`,
    );
  });

  it("renders both party types and links to the next claimant index", () => {
    renderOverview({ klagenden: [organization, naturalPerson] });

    expect(screen.getAllByTestId("klage-partei")).toHaveLength(2);
    expect(
      screen.getByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.klagendeParteiHeadline.de} 1) ${translations.arraySummary.arrayEditButtonLabel.de}`,
      }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/1/natuerliche-person-daten",
    );
    expect(
      screen.getByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.klagendeParteiHeadline.de} 2) ${translations.arraySummary.arrayEditButtonLabel.de}`,
      }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/0/organisation-daten",
    );
    const naturalPersonsHeading = screen.getByRole("heading", {
      name: translations.geldEinklagenAnwaltschaft.natuerlichePersonenHeadline
        .de,
    });
    const organizationsHeading = screen.getByRole("heading", {
      name: translations.geldEinklagenAnwaltschaft.organisationenHeadline.de,
    });
    expect(naturalPersonsHeading.closest(".kern-summary")).toBeInTheDocument();
    expect(organizationsHeading.closest(".kern-summary")).toBeInTheDocument();
    expect(screen.getByTestId("add-natuerliche-person")).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/2/natuerliche-person-daten",
    );
    expect(screen.getByTestId("add-organisation")).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/2/organisation-daten",
    );
  });

  it("recalculates organization numbers when natural persons are added or removed", () => {
    const initialParties = [organization, naturalPerson];
    const { rerender } = renderOverview({ klagenden: initialParties });
    const partyHeadline =
      translations.geldEinklagenAnwaltschaft.klagendeParteiHeadline.de;
    const editLabel = translations.arraySummary.arrayEditButtonLabel.de;

    expect(
      screen.getByRole("link", { name: `${partyHeadline} 2) ${editLabel}` }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/0/organisation-daten",
    );

    vi.mocked(useFormFlow).mockReturnValue({
      userData: { klagenden: [...initialParties, naturalPerson] },
      flowId: "/geld-einklagen/anwaltschaft",
      translations: {},
      validFlowPages: {},
    });
    rerender(
      <MemoryRouter>
        <KlageParteienUebersicht relationship="klagende" />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: `${partyHeadline} 3) ${editLabel}` }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/0/organisation-daten",
    );

    vi.mocked(useFormFlow).mockReturnValue({
      userData: { klagenden: initialParties },
      flowId: "/geld-einklagen/anwaltschaft",
      translations: {},
      validFlowPages: {},
    });
    rerender(
      <MemoryRouter>
        <KlageParteienUebersicht relationship="klagende" />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: `${partyHeadline} 2) ${editLabel}` }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/0/organisation-daten",
    );
  });

  it("preserves the rendered party identity when deletion changes its index", () => {
    const firstParty = {
      ...naturalPerson,
      id: "11111111-1111-4111-8111-111111111111",
    };
    const secondParty = {
      ...naturalPerson,
      id: "22222222-2222-4222-8222-222222222222",
    };
    const { rerender } = renderOverview({
      klagenden: [firstParty, secondParty],
    });
    const secondPartyElement = screen.getAllByTestId("klage-partei")[1];
    vi.mocked(useFormFlow).mockReturnValue({
      userData: { klagenden: [secondParty] },
      flowId: "/geld-einklagen/anwaltschaft",
      translations: {},
      validFlowPages: {},
    });

    rerender(
      <MemoryRouter>
        <KlageParteienUebersicht relationship="klagende" />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("klage-partei")).toBe(secondPartyElement);
    expect(
      screen.getByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.klagendeParteiHeadline.de} 1) ${translations.arraySummary.arrayEditButtonLabel.de}`,
      }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/0/natuerliche-person-daten",
    );
  });

  it("uses the defendant data and relationship when rendering the defendant overview", () => {
    renderOverview({ beklagten: [organization] }, "beklagte");

    expect(screen.getAllByTestId("klage-partei")).toHaveLength(1);
    expect(
      screen.getByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.beklagteParteiHeadline.de} 1) ${translations.arraySummary.arrayEditButtonLabel.de}`,
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("add-organisation")).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/beklagte-partei/beklagten/1/organisation-daten",
    );
  });

  it("does not render outside the anwaltschaft flow", () => {
    const { container } = renderOverview(
      { klagenden: [naturalPerson] },
      "klagende",
      "/beratungshilfe/antrag",
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("disables adding a party type at its maximum while keeping the other type available", () => {
    const naturalPersonen = Array.from(
      { length: MAX_KLAGE_PARTIES },
      (_, index) => ({ ...naturalPerson, index: index + 1 }),
    );

    renderOverview({ klagenden: naturalPersonen });

    expect(screen.getByTestId("add-natuerliche-person")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByTestId("add-organisation")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});
