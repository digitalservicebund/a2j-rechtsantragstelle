import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import type { KlageParteien } from "../../shared/klageParties/klagePartySchemas";
import {
  getVerb,
  getBeklagteText,
  getKlagendeText,
  getBefindenText,
  getNebenantragItemText,
  getBezifferterAntragText,
  getUnbezifferterSchmerzensgeldantragText,
} from "../hauptUndNebenantraegeContent";

const party = (id: string) => ({
  id,
  type: "natuerliche-person" as const,
  anrede: "frau" as const,
  titel: "",
  vorname: "Test",
  nachname: "Person",
  strasse: "Musterstraße",
  hausnummer: "1",
  plz: "12345",
  ort: "Berlin",
  land: "Deutschland",
});

const beklagten = [
  party("11111111-1111-4111-8111-111111111111"),
  party("22222222-2222-4222-8222-222222222222"),
];
const klagenden = [
  party("33333333-3333-4333-8333-333333333333"),
  party("44444444-4444-4444-8444-444444444444"),
];

const organisation = (id: string): KlageParteien[number] => ({
  id,
  type: "organisation",
  orgName: "Firma GmbH",
  orgVertretungArt: "geschaeftsfuehrer-geschaeftsfuehrerin",
  orgVertretungAnrede: "frau",
  orgVertretungTitel: "",
  orgVertretungVorname: "Test",
  orgVertretungNachname: "Person",
  strasse: "Musterstraße",
  hausnummer: "1",
  plz: "12345",
  ort: "Berlin",
  land: "Deutschland",
});

const createUserData = (
  overrides: Partial<GeldEinklagenAnwaltschaftUserData> = {},
): GeldEinklagenAnwaltschaftUserData => ({
  beklagten,
  klagenden,
  ...overrides,
});

const textContent = (node: ReactNode) => {
  return renderToStaticMarkup(node)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

describe("hauptUndNebenantraegeContent", () => {
  it("should use the singular and plural Beklagte labels", () => {
    expect(getBeklagteText(1)).toBe("Der Beklagte");
    expect(getBeklagteText(2)).toBe("Die Beklagten");
  });

  it("should use the singular and plural Klagende labels", () => {
    expect(getKlagendeText(1)).toBe("den Kläger");
    expect(getKlagendeText(2)).toBe("die Kläger");
  });

  it("should use the singuler and plural befindet labels", () => {
    expect(getBefindenText(1)).toBe("befindet");
    expect(getBefindenText(2)).toBe("befinden");
  });

  it("should use the singular and plural verb labels", () => {
    expect(getVerb(1)).toBe("wird");
    expect(getVerb(2)).toBe("werden");
  });

  it("should format a Bezifferter Zahlungs Nebenantrag", () => {
    const userData = createUserData({
      hauptantrag: [
        {
          betragForderung: "100",
          beklagte: {
            [beklagten[0].id]: "on",
            [beklagten[1].id]: "on",
          },
          klagende: { [klagenden[1].id]: "on" },
          zinsbeginn: { day: "1", month: "2", year: "2024" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(
        getNebenantragItemText({
          item: {
            type: "nebenantrag",
            nebenantragArt: "mahnkosten",
            nebenantragBetrag: "25",
            nebenantragZinssatzInProzent: 5,
            nebenantragZinsmethode: "jaehrlicherZinssatz",
            nebenantragZinsbeginn: { day: "1", month: "2", year: "2024" },
          },
          userData,
          hauptantragIndex: 0,
        }),
      ),
    ).toBe(
      "Die Beklagten zu 1) und zu 2) werden als Gesamtschuldner verurteilt an, den Kläger zu 2) Mahnkosten in Höhe von 25 Euro nebst Zinsen in Höhe von 5 Prozent p.a. seit dem 01.02.2024 zu zahlen.",
    );
  });

  it("should format an Annahmeverzug", () => {
    const userData = createUserData({
      hauptantrag: [
        {
          betragForderung: "100",
          beklagte: { [beklagten[1].id]: "on" },
          klagende: {},
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
        {
          betragForderung: "200",
          beklagte: { [beklagten[1].id]: "on" },
          klagende: {},
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(
        getNebenantragItemText({
          item: {
            type: "annahmeverzug",
            annahmeverzugsFeststellung: "on",
            annahmeverzugDatum: { day: "3", month: "4", year: "2025" },
          },
          userData,
          hauptantragIndex: 1,
        }),
      ),
    ).toBe(
      "Es wird festgestellt, dass sich der Beklagte zu 2) mit der Annahme der im Antrag zu 2) genannten Gegenleistung seit dem 03.04.2025 in Annahmeverzug befindet.",
    );
  });

  it("should use plural defendant wording and omit an incomplete Annahmeverzug date", () => {
    const userData = createUserData({
      hauptantrag: [
        {
          betragForderung: "100",
          beklagte: {
            [beklagten[0].id]: "on",
            [beklagten[1].id]: "on",
          },
          klagende: {},
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(
        getNebenantragItemText({
          item: {
            type: "annahmeverzug",
            annahmeverzugsFeststellung: "on",
            annahmeverzugDatum: { day: "3", month: "", year: "2025" },
          },
          userData,
          hauptantragIndex: 0,
        }),
      ),
    ).toBe(
      "Es wird festgestellt, dass sich die Beklagten zu 1) und zu 2) mit der Annahme der im Antrag zu 1) genannten Gegenleistung in Annahmeverzug befinden.",
    );
  });

  it("should format a Schmerzengeld Nebenantrag", () => {
    const userData = createUserData({
      schmerzengeldantrag: [
        {
          mindestBetrag: "500",
          beklagte: { [beklagten[0].id]: "on" },
          klagende: { [klagenden[0].id]: "on" },
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(
        getNebenantragItemText({
          item: {
            schmerzengeldNebenantragArt: "inkassokosten",
            schmerzengeldNebenantragBetrag: "12",
            schmerzengeldNebenantragZinssatzInProzent: 3,
            schmerzengeldNebenantragZinsmethode: "jaehrlicherZinssatz",
            schmerzengeldNebenantragZinsbeginn: {
              day: "1",
              month: "1",
              year: "2025",
            },
          },
          userData,
          schmerzengeldantragIndex: 0,
        }),
      ),
    ).toBe(
      "Der Beklagte zu 1) wird verurteilt an, den Kläger zu 1) Inkassokosten in Höhe von 12 Euro nebst Zinsen in Höhe von 3 Prozent p.a. seit dem 01.01.2025 zu zahlen.",
    );
  });

  it("uses Rechtshängigkeit when a Hauptantrag has no interest start date", () => {
    const userData = createUserData({
      hauptantrag: [
        {
          betragForderung: "1.000,00",
          beklagte: { [beklagten[1].id]: "on" },
          klagende: { [klagenden[1].id]: "on" },
          zinssatzInProzent: 12,
          zinsmethode: "monatlicherZinssatzUeberBasiszins",
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(getBezifferterAntragText({ userData, hauptantragIndex: 0 })),
    ).toContain(
      "nebst Zinsen in Höhe von 12 Prozentpunkten über dem jeweiligen Basiszinssatz p.a., monatlich abrechenbar seit Rechtshängigkeit zu zahlen.",
    );
  });

  it("uses Rechtshängigkeit with an end date for a Nebenantrag", () => {
    const userData = createUserData({
      hauptantrag: [
        {
          betragForderung: "100",
          beklagte: { [beklagten[0].id]: "on" },
          klagende: { [klagenden[0].id]: "on" },
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(
        getNebenantragItemText({
          item: {
            type: "nebenantrag",
            nebenantragArt: "mahnkosten",
            nebenantragBetrag: "25",
            nebenantragZinssatzInProzent: 5,
            nebenantragZinsmethode: "jaehrlicherZinssatz",
            nebenantragZinsende: { day: "3", month: "4", year: "2025" },
          },
          userData,
          hauptantragIndex: 0,
        }),
      ),
    ).toContain(
      "nebst Zinsen in Höhe von 5 Prozent p.a. seit Rechtshängigkeit bis zum 03.04.2025 zu zahlen.",
    );
  });

  it("keeps the Rechtshängigkeit fallback for Schmerzensgeld interest", () => {
    const userData = createUserData({
      schmerzengeldantrag: [
        {
          mindestBetrag: "500",
          beklagte: { [beklagten[0].id]: "on" },
          klagende: { [klagenden[0].id]: "on" },
          zinssatzInProzent: 5,
          zinsmethode: "jaehrlicherZinssatz",
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(
        getUnbezifferterSchmerzensgeldantragText({
          userData,
          schmerzengeldantragIndex: 0,
        }),
      ),
    ).toContain(
      "nebst Zinsen in Höhe von 5 Prozent p.a. seit Rechtshängigkeit.",
    );

    expect(
      renderToStaticMarkup(
        getUnbezifferterSchmerzensgeldantragText({
          userData,
          schmerzengeldantragIndex: 0,
        }),
      ),
    ).toContain(
      "<strong>Der Beklagte zu 1)</strong> wird verurteilt an, <strong>der Kläger zu 1)</strong>",
    );
  });

  it("prefixes each selected party number in a Bezifferter Antrag", () => {
    const userData = createUserData({
      hauptantrag: [
        {
          betragForderung: "1.000,00",
          beklagte: { [beklagten[0].id]: "on", [beklagten[1].id]: "on" },
          klagende: { [klagenden[0].id]: "on", [klagenden[1].id]: "on" },
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    const markup = renderToStaticMarkup(
      getBezifferterAntragText({ userData, hauptantragIndex: 0 }),
    );
    expect(markup).toContain("<strong>Die Beklagten zu 1) und zu 2)</strong>");
    expect(markup).toContain("<strong>die Kläger zu 1) und zu 2)</strong>");
  });

  it("does not duplicate the prefix in a Schmerzensgeldantrag", () => {
    const userData = createUserData({
      schmerzengeldantrag: [
        {
          mindestBetrag: "500",
          beklagte: { [beklagten[0].id]: "on", [beklagten[1].id]: "on" },
          klagende: { [klagenden[0].id]: "on", [klagenden[1].id]: "on" },
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    const markup = renderToStaticMarkup(
      getUnbezifferterSchmerzensgeldantragText({
        userData,
        schmerzengeldantragIndex: 0,
      }),
    );
    expect(markup).toContain("<strong>Die Beklagten zu 1) und zu 2)</strong>");
    expect(markup).toContain("<strong>die Kläger zu 1) und zu 2)</strong>");
  });

  it("uses the displayed party order in a Schmerzensgeldantrag", () => {
    const defendants = [
      organisation("org-defendant"),
      party("other-defendant"),
      party("selected-defendant"),
    ];
    const plaintiffs = [
      organisation("org-plaintiff"),
      party("other-plaintiff"),
      party("selected-plaintiff"),
    ];
    const userData = createUserData({
      beklagten: defendants,
      klagenden: plaintiffs,
      schmerzengeldantrag: [
        {
          mindestBetrag: "12,00",
          beklagte: { "org-defendant": "on" },
          klagende: { "selected-plaintiff": "on" },
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(
        getUnbezifferterSchmerzensgeldantragText({
          userData,
          schmerzengeldantragIndex: 0,
        }),
      ),
    ).toBe(
      "Der Beklagte zu 3) wird verurteilt an, der Kläger zu 2) ein in das Ermessen des Gerichts gestelltes Schmerzensgeld zu zahlen, welches einen Betrag von 12,00 Euro nicht unterschreiten sollte.",
    );
  });

  it("uses the displayed party order in a Bezifferter Antrag", () => {
    const defendants = [
      organisation("org-defendant"),
      party("other-defendant"),
      party("selected-defendant"),
    ];
    const plaintiffs = [
      organisation("org-plaintiff"),
      party("other-plaintiff"),
      party("selected-plaintiff"),
    ];
    const userData = createUserData({
      beklagten: defendants,
      klagenden: plaintiffs,
      hauptantrag: [
        {
          betragForderung: "12,00",
          beklagte: { "org-defendant": "on" },
          klagende: { "selected-plaintiff": "on" },
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(getBezifferterAntragText({ userData, hauptantragIndex: 0 })),
    ).toBe(
      "Der Beklagte zu 3) wird verurteilt an, den Kläger zu 2) 12,00 Euro zu zahlen.",
    );
  });

  it("separates three or more selected parties with commas and a final und", () => {
    const defendants = [
      ...beklagten,
      party("55555555-5555-4555-8555-555555555555"),
      party("66666666-6666-4666-8666-666666666666"),
    ];
    const plaintiffs = [
      ...klagenden,
      party("77777777-7777-4777-8777-777777777777"),
      party("88888888-8888-4888-8888-888888888888"),
    ];
    const selectedParties = {
      beklagte: {
        [defendants[0].id]: "on" as const,
        [defendants[2].id]: "on" as const,
        [defendants[3].id]: "on" as const,
      },
      klagende: Object.fromEntries(
        plaintiffs.map(({ id }) => [id, "on" as const]),
      ),
      zinsbeginn: { day: "", month: "", year: "" },
      zinsende: { day: "", month: "", year: "" },
    };
    const userData = createUserData({
      beklagten: defendants,
      klagenden: plaintiffs,
      hauptantrag: [{ ...selectedParties, betragForderung: "100" }],
      schmerzengeldantrag: [{ ...selectedParties, mindestBetrag: "500" }],
    });

    const bezifferter = renderToStaticMarkup(
      getBezifferterAntragText({ userData, hauptantragIndex: 0 }),
    );
    const schmerzensgeld = renderToStaticMarkup(
      getUnbezifferterSchmerzensgeldantragText({
        userData,
        schmerzengeldantragIndex: 0,
      }),
    );
    for (const markup of [bezifferter, schmerzensgeld]) {
      expect(markup).toContain(
        "<strong>Die Beklagten zu 1), zu 3) und zu 4)</strong>",
      );
      expect(markup).toContain(
        "<strong>die Kläger zu 1), zu 2), zu 3) und zu 4)</strong>",
      );
    }

    const nebenantrag = textContent(
      getNebenantragItemText({
        item: {
          type: "nebenantrag",
          nebenantragArt: "mahnkosten",
          nebenantragBetrag: "25",
        },
        userData,
        hauptantragIndex: 0,
      }),
    );
    expect(nebenantrag).toContain("Die Beklagten zu 1), zu 3) und zu 4)");
    expect(nebenantrag).toContain("die Kläger zu 1), zu 2), zu 3) und zu 4)");
  });

  it("should include the amount, interest, and Zug-um-Zug description in a Hauptantrag", () => {
    const userData = createUserData({
      hauptantrag: [
        {
          betragForderung: "125,50",
          beklagte: { [beklagten[0].id]: "on" },
          klagende: { [klagenden[0].id]: "on" },
          zinssatzInProzent: 5,
          zinsmethode: "jaehrlicherZinssatz",
          zinsbeginn: { day: "1", month: "2", year: "2024" },
          zinsende: { day: "", month: "", year: "" },
          zugUndZug: "on",
          beschreibungDerGegenleistung: "Rückgabe der Sache",
        },
      ],
    });

    expect(
      textContent(getBezifferterAntragText({ userData, hauptantragIndex: 0 })),
    ).toBe(
      "Der Beklagte zu 1) wird verurteilt an, den Kläger zu 1) 125,50 Euro nebst Zinsen in Höhe von 5 Prozent p.a. seit dem 01.02.2024 Zug-um-Zug gegen Rückgabe der Sache zu zahlen.",
    );
  });

  it.each([
    {
      details: {},
      ending: "12,00 Euro zu zahlen.",
    },
    {
      details: {
        zinssatzInProzent: 12,
        zinsmethode: "monatlicherZinssatzUeberBasiszins" as const,
        zinsbeginn: { day: "1", month: "1", year: "2025" },
        zinsende: { day: "1", month: "1", year: "2026" },
      },
      ending:
        "12,00 Euro nebst Zinsen in Höhe von 12 Prozentpunkten über dem jeweiligen Basiszinssatz p.a., monatlich abrechenbar seit dem 01.01.2025 bis zum 01.01.2026 zu zahlen.",
    },
    {
      details: {
        zugUndZug: "on" as const,
        beschreibungDerGegenleistung: "Gegenleistung Beispiel",
      },
      ending: "12,00 Euro Zug-um-Zug gegen Gegenleistung Beispiel zu zahlen.",
    },
    {
      details: {
        zugUndZug: "on" as const,
      },
      ending: "12,00 Euro Zug-um-Zug zu zahlen.",
    },
    {
      details: {
        zinssatzInProzent: 12,
        zinsmethode: "monatlicherZinssatzUeberBasiszins" as const,
        zinsbeginn: { day: "1", month: "1", year: "2025" },
        zinsende: { day: "1", month: "1", year: "2026" },
        zugUndZug: "on" as const,
        beschreibungDerGegenleistung: "Gegenleistung Beispiel",
      },
      ending:
        "12,00 Euro nebst Zinsen in Höhe von 12 Prozentpunkten über dem jeweiligen Basiszinssatz p.a., monatlich abrechenbar seit dem 01.01.2025 bis zum 01.01.2026 Zug-um-Zug gegen Gegenleistung Beispiel zu zahlen.",
    },
  ])(
    "ends a Bezifferter Antrag with one payment instruction: $ending",
    ({ details, ending }) => {
      const userData = createUserData({
        hauptantrag: [
          {
            betragForderung: "12,00",
            beklagte: { [beklagten[0].id]: "on" },
            klagende: { [klagenden[0].id]: "on" },
            zinsbeginn: { day: "", month: "", year: "" },
            zinsende: { day: "", month: "", year: "" },
            ...details,
          },
        ],
      });

      expect(
        textContent(
          getBezifferterAntragText({ userData, hauptantragIndex: 0 }),
        ),
      ).toBe(
        `Der Beklagte zu 1) wird verurteilt an, den Kläger zu 1) ${ending}`,
      );
    },
  );

  it("does not add another payment instruction to a Schmerzensgeldantrag", () => {
    const userData = createUserData({
      schmerzengeldantrag: [
        {
          mindestBetrag: "500",
          beklagte: { [beklagten[0].id]: "on" },
          klagende: { [klagenden[0].id]: "on" },
          zinsbeginn: { day: "", month: "", year: "" },
          zinsende: { day: "", month: "", year: "" },
        },
      ],
    });

    expect(
      textContent(
        getUnbezifferterSchmerzensgeldantragText({
          userData,
          schmerzengeldantragIndex: 0,
        }),
      ),
    ).toBe(
      "Der Beklagte zu 1) wird verurteilt an, der Kläger zu 1) ein in das Ermessen des Gerichts gestelltes Schmerzensgeld zu zahlen, welches einen Betrag von 500 Euro nicht unterschreiten sollte.",
    );
  });
});
