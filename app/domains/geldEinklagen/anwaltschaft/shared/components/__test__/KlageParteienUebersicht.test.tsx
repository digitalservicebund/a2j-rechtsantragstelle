import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { type FlowId } from "~/domains/flowIds";
import {
  MAX_NATURAL_PERSON_REPRESENTATIVES,
  type KlageParteien,
  type KlageParteiVerhaeltnis,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { KlageParteienUebersicht } from "~/domains/geldEinklagen/anwaltschaft/shared/components/KlageParteienUebersicht";
import { MAX_KLAGE_PARTEIEN } from "~/domains/geldEinklagen/anwaltschaft/shared/useKlageParteien";
import { type UserData } from "~/domains/userData";
import { translations } from "~/services/translations/translations";

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
  it("links to the next representative from the overview below the natural-person limit", () => {
    renderOverview({
      klagenden: [
        {
          ...naturalPerson,
          "gesetzliche-vertretung": Array.from(
            { length: MAX_NATURAL_PERSON_REPRESENTATIVES - 1 },
            () => ({ art: "Elternteil" as const }),
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
            { length: MAX_NATURAL_PERSON_REPRESENTATIVES },
            () => ({ art: "Elternteil" as const }),
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
          orgVertretungArt: "Vorstand / Vorständin",
          orgVertretungAnrede: "herr",
          orgVertretungTitel: "",
          orgVertretungVorname: "Max",
          orgVertretungNachname: "Mustermann",
          "gesetzliche-vertretung": Array.from({ length: 6 }, () => ({
            art: "Vorstand / Vorständin" as const,
          })),
        },
      ],
    });

    expect(
      screen.getByText("Vorstand / Vorständin: herr Max Mustermann"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.gesetzlicheVetretungHeadline.de} ${translations.arraySummary.arrayAddButtonLabel.de}`,
      }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/0/gesetzliche-vertretung/6/daten",
    );
  });

  it("renders both party types and links to the next claimant index", () => {
    renderOverview({ klagenden: [organization, naturalPerson] });

    expect(screen.getAllByTestId("klage-partei")).toHaveLength(2);
    expect(
      screen.getByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.klagendeParteiHeadline.de} 2) ${translations.arraySummary.arrayEditButtonLabel.de}`,
      }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden/1/natuerliche-person-daten",
    );
    expect(
      screen.getByRole("link", {
        name: `${translations.geldEinklagenAnwaltschaft.klagendeParteiHeadline.de} 1) ${translations.arraySummary.arrayEditButtonLabel.de}`,
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
      { length: MAX_KLAGE_PARTEIEN },
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
