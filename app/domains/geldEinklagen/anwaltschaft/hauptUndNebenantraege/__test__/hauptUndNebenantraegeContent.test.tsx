import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { translations } from "~/services/translations/translations";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import {
  getBezifferterAntragText,
  getNebenantragItemText,
  getUnbezifferterSchmerzensgeldantragText,
} from "../hauptUndNebenantraegeContent";
import {
  hauptantraegeArraySchema,
  schmerzengeldantragSchema,
  type Nebenantrag,
  type SchmerzengeldNebenantrag,
} from "../hauptUndNebenantraegeSchemas";
import { UnbezifferteSchmerzensgeldNebenantragItem } from "../unbezifferteSchmerzensgeldUndNebenantraege/UnbezifferteSchmerzensgeldNebenantragItem";

vi.mock("~/components/hooks/useDeleteArrayItem", () => ({
  useDeleteArrayItem: vi.fn(() => vi.fn()),
}));

type Schmerzensgeldantrag = NonNullable<
  GeldEinklagenAnwaltschaftUserData["schmerzengeldantrag"]
>[number];

const parties = Array.from({ length: 6 }, (_, index) => ({
  id: `party-${index + 1}`,
  type: "natuerliche-person" as const,
  anrede: "none" as const,
  vorname: "Max",
  nachname: "Muster",
  strasse: "Musterstraße",
  hausnummer: "1",
  plz: "12345",
  ort: "Berlin",
  land: "Deutschland",
}));

const emptyDate = { day: undefined, month: undefined, year: undefined };

const antrag = {
  mindestBetrag: "1.200,00",
  beklagte: { "party-2": "on" },
  klagende: { "party-3": "on" },
  zinsbeginn: emptyDate,
  zinsende: emptyDate,
} satisfies Schmerzensgeldantrag;

const amountText =
  "ein in das Ermessen des Gerichts gestelltes Schmerzensgeld zu zahlen, welches einen Betrag von 1.200,00 Euro nicht unterschreiten sollte";
const singlePartyText =
  "Der Beklagte zu 2) wird verurteilt, an den Kläger zu 3) ";

const renderText = (overrides: Partial<Schmerzensgeldantrag> = {}) => {
  const { container } = render(
    getUnbezifferterSchmerzensgeldantragText({
      userData: {
        beklagten: parties,
        klagenden: parties,
        schmerzengeldantrag: [{ ...antrag, ...overrides }],
      },
      schmerzengeldantragIndex: 0,
    }),
  );
  return container.textContent;
};

describe("getUnbezifferterSchmerzensgeldantragText", () => {
  it("renders a single selected party on each side and the amount as entered", () => {
    expect(renderText()).toBe(`${singlePartyText}${amountText}.`);
  });

  it("renders the full example with non-consecutive selections in party order", () => {
    expect(
      renderText({
        beklagte: {
          "party-6": "on",
          "party-4": "on",
          "party-1": "off",
          "party-3": "on",
          "party-2": "on",
        },
        klagende: {
          "party-6": "on",
          "party-1": "on",
          "party-3": "on",
          "party-5": "on",
        },
        zinssatzInProzent: 5,
        zinsmethode: "jaehrlicherZinssatzUeberBasiszins",
      }),
    ).toBe(
      `Die Beklagten zu 2), zu 3), zu 4) und zu 6) werden als Gesamtschuldner verurteilt, an die Kläger zu 1), zu 3), zu 5) und zu 6) als Gesamtgläubiger ${amountText}, nebst Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz p.a. seit Rechtshängigkeit.`,
    );
  });

  it("handles plural defendants independently of singular plaintiffs", () => {
    expect(
      renderText({
        beklagte: { "party-2": "on", "party-6": "on" },
      }),
    ).toBe(
      `Die Beklagten zu 2) und zu 6) werden als Gesamtschuldner verurteilt, an den Kläger zu 3) ${amountText}.`,
    );
  });

  it("handles plural plaintiffs independently of singular defendants", () => {
    expect(
      renderText({
        klagende: { "party-1": "on", "party-5": "on" },
      }),
    ).toBe(
      `Der Beklagte zu 2) wird verurteilt, an die Kläger zu 1) und zu 5) als Gesamtgläubiger ${amountText}.`,
    );
  });

  it.each([
    [
      "jaehrlicherZinssatzUeberBasiszins",
      "Prozentpunkten über dem jeweiligen Basiszinssatz p.a.",
    ],
    ["jaehrlicherZinssatz", "Prozent p.a."],
    [
      "monatlicherZinssatzUeberBasiszins",
      "Prozentpunkten über dem jeweiligen Basiszinssatz p.a., monatlich abrechenbar",
    ],
    ["monatlicherZinssatz", "Prozent p.a., monatlich abrechenbar"],
  ] satisfies Array<[Schmerzensgeldantrag["zinsmethode"], string]>)(
    "renders the interest method %s",
    (zinsmethode, expected) => {
      expect(renderText({ zinssatzInProzent: 5, zinsmethode })).toBe(
        `${singlePartyText}${amountText}, nebst Zinsen in Höhe von 5 ${expected} seit Rechtshängigkeit.`,
      );
    },
  );

  it.each([
    [emptyDate, emptyDate, "seit Rechtshängigkeit"],
    [{ day: "", month: "", year: "" }, emptyDate, "seit Rechtshängigkeit"],
    [{ day: "2", month: "3", year: "2026" }, emptyDate, "seit dem 02.03.2026"],
    [
      emptyDate,
      { day: "4", month: "5", year: "2026" },
      "seit Rechtshängigkeit bis zum 04.05.2026",
    ],
    [
      { day: "2", month: "3", year: "2026" },
      { day: "4", month: "5", year: "2026" },
      "seit dem 02.03.2026 bis zum 04.05.2026",
    ],
  ])("renders the interest period %#", (zinsbeginn, zinsende, expected) => {
    expect(
      renderText({
        zinssatzInProzent: 5,
        zinsmethode: "jaehrlicherZinssatz",
        zinsbeginn,
        zinsende,
      }),
    ).toBe(
      `${singlePartyText}${amountText}, nebst Zinsen in Höhe von 5 Prozent p.a. ${expected}.`,
    );
  });

  it.each([
    {},
    { zinssatzInProzent: "", zinsmethode: "" },
    { zinssatzInProzent: 5 },
    { zinsmethode: "jaehrlicherZinssatz" },
    { zinssatzInProzent: "", zinsmethode: "jaehrlicherZinssatz" },
    { zinssatzInProzent: 5, zinsmethode: "" },
    { zinsbeginn: { day: "2", month: "3", year: "2026" } },
  ] satisfies Array<Partial<Schmerzensgeldantrag>>)(
    "omits the entire interest clause for incomplete interest selection %#",
    (interest) => {
      expect(renderText(interest)).toBe(`${singlePartyText}${amountText}.`);
    },
  );

  it("does not treat a zero interest rate as an absent rate", () => {
    expect(
      renderText({ zinssatzInProzent: 0, zinsmethode: "jaehrlicherZinssatz" }),
    ).toBe(
      `${singlePartyText}${amountText}, nebst Zinsen in Höhe von 0 Prozent p.a. seit Rechtshängigkeit.`,
    );
  });

  it.each([undefined, []])(
    "renders nothing for a missing application %s",
    (schmerzengeldantrag) => {
      const { container } = render(
        getUnbezifferterSchmerzensgeldantragText({
          userData: { schmerzengeldantrag },
          schmerzengeldantragIndex: 0,
        }),
      );
      expect(container).toBeEmptyDOMElement();
    },
  );
});

it("preserves the wording, dates, and Zug-um-Zug clause of quantified applications", () => {
  const { container } = render(
    getBezifferterAntragText({
      userData: {
        beklagten: parties,
        klagenden: parties,
        hauptantrag: [
          {
            ...antrag,
            betragForderung: "500,00",
            zinssatzInProzent: 5,
            zinsmethode: "jaehrlicherZinssatz",
            zinsbeginn: { day: "2", month: "3", year: "2026" },
            zinsende: { day: "4", month: "5", year: "2026" },
            zugUndZug: "on",
            beschreibungDerGegenleistung: "Rückgabe",
          },
        ],
      },
      hauptantragIndex: 0,
    }),
  );
  expect(container.textContent).toBe(
    "Die Beklagte 2) wird verurteilt, die Klagende 3)  einen Betrag in Höhe von 500,00 Euro nebst Zinsen in Höhe von 5 Prozent p. a. vom 02.03.2026 bis zum 04.05.2026, Zug-um-Zug gegen: Rückgabe.",
  );
});

const nebenantrag: Extract<Nebenantrag, { type: "nebenantrag" }> = {
  type: "nebenantrag",
  nebenantragArt: "mahnkosten",
  nebenantragBetrag: "25,00",
};

const schmerzensgeldNebenantrag: SchmerzengeldNebenantrag = {
  schmerzengeldNebenantragArt: "mahnkosten",
  schmerzengeldNebenantragBetrag: "25,00",
};

const nebenantragUserData: GeldEinklagenAnwaltschaftUserData = {
  beklagten: parties,
  klagenden: parties,
  hauptantrag: [{ ...antrag, betragForderung: "500,00" }],
  schmerzengeldantrag: [
    antrag,
    {
      ...antrag,
      beklagte: { "party-1": "on", "party-4": "on" },
      klagende: { "party-5": "on" },
      nebenantraege: [schmerzensgeldNebenantrag],
    },
  ],
};

describe("getNebenantragItemText parent selection", () => {
  it("uses the selected Schmerzensgeldantrag rather than the quantified application", () => {
    const { container } = render(
      getNebenantragItemText({
        item: schmerzensgeldNebenantrag,
        userData: nebenantragUserData,
        schmerzengeldantragIndex: 1,
      }),
    );
    expect(container.textContent).toBe(
      "Die Beklagten zu 1), zu 4) werden als Gesamtschuldner verurteilt, die Klagende zu 5) Mahnkosten in Höhe von 25,00",
    );
  });

  it("preserves the quantified application's parties", () => {
    const { container } = render(
      getNebenantragItemText({
        item: nebenantrag,
        userData: nebenantragUserData,
        hauptantragIndex: 0,
      }),
    );
    expect(container.textContent).toBe(
      "Die Beklagte zu 2) wird verurteilt, die Klagende zu 3) Mahnkosten in Höhe von 25,00",
    );
  });

  it("renders interest from Schmerzensgeld Nebenantrag fields without a type discriminator", () => {
    const { container } = render(
      getNebenantragItemText({
        item: {
          ...schmerzensgeldNebenantrag,
          schmerzengeldNebenantragZinssatzInProzent: 5,
          schmerzengeldNebenantragZinsmethode: "jaehrlicherZinssatz",
          schmerzengeldNebenantragZinsbeginn: {
            day: "1",
            month: "2",
            year: "2026",
          },
        },
        userData: nebenantragUserData,
        schmerzengeldantragIndex: 1,
      }),
    );
    expect(container).toHaveTextContent(
      "Mahnkosten in Höhe von 25,00 nebst Zinsen in Höhe von 5 Prozent p. a. seit dem 01.02.2026",
    );
  });

  it("preserves Annahmeverzug for quantified applications", () => {
    const { container } = render(
      getNebenantragItemText({
        item: {
          type: "annahmeverzug",
          annahmeverzugsFeststellung: "on",
          annahmeverzugDatum: emptyDate,
        },
        userData: nebenantragUserData,
        hauptantragIndex: 0,
      }),
    );
    expect(container.textContent).toBe(
      "Es wird festgestellt, dass sich die beklagte 2) mit der Annahme der im Antrag zu 1) genannten Gegenleistung in Annahmeverzug befindet.",
    );
  });
});

describe("UnbezifferteSchmerzensgeldNebenantragItem", () => {
  it("allows only Nebenanträge for Schmerzensgeld but preserves Annahmeverzug for Hauptanträge", () => {
    const schmerzensgeldChildren =
      schmerzengeldantragSchema.element.shape.nebenantraege;
    const quantifiedChildren =
      hauptantraegeArraySchema.element.shape.nebenantraege;
    const annahmeverzug = {
      type: "annahmeverzug",
      annahmeverzugsFeststellung: "on",
      annahmeverzugDatum: emptyDate,
    };

    expect(
      schmerzensgeldChildren.safeParse([schmerzensgeldNebenantrag]).success,
    ).toBe(true);
    expect(schmerzensgeldChildren.safeParse(undefined).success).toBe(true);
    expect(schmerzensgeldChildren.safeParse([annahmeverzug]).success).toBe(
      false,
    );
    expect(quantifiedChildren.safeParse([annahmeverzug]).success).toBe(true);
  });

  it("renders nested Nebenanträge with the correct parties and deletion target", () => {
    const { container } = render(
      <MemoryRouter>
        <UnbezifferteSchmerzensgeldNebenantragItem
          userData={nebenantragUserData}
          parentArrayItemIndex={1}
        />
      </MemoryRouter>,
    );
    expect(container).toHaveTextContent(
      "Die Beklagten zu 1), zu 4) werden als Gesamtschuldner",
    );
    expect(container).toHaveTextContent("Mahnkosten in Höhe von 25,00");
    expect(container).not.toHaveTextContent("Ermessen des Gerichts");
    expect(
      screen.getByRole("button", { name: "Nebenantrag 1 löschen" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Nebenantrag 1 bearbeiten" }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/1/nebenantraege/0/daten",
    );
    expect(useDeleteArrayItem).toHaveBeenLastCalledWith(
      "schmerzengeldantrag#nebenantraege",
      "/geld-einklagen/anwaltschaft/schmerzengeldantrag/1",
      expect.any(Function),
    );
    expect(
      screen.getByRole("link", {
        name: translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de,
      }),
    ).toHaveAttribute(
      "href",
      "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/1/nebenantraege/1/daten",
    );
  });

  it("does not render other applications as Nebenanträge when the parent has none", () => {
    render(
      <MemoryRouter>
        <UnbezifferteSchmerzensgeldNebenantragItem
          userData={nebenantragUserData}
          parentArrayItemIndex={0}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /bearbeiten/ }),
    ).not.toBeInTheDocument();
  });
});
