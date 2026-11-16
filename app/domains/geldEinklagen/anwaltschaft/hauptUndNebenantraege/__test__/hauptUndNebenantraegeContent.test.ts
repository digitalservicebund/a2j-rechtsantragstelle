import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import {
  getVerb,
  getBeklagteText,
  getKlagendeText,
  getBefindenText,
  getNebenantragItemText,
  getBezifferterAntragText,
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
    expect(getBeklagteText(1)).toBe("Die Beklagte");
    expect(getBeklagteText(2)).toBe("Die Beklagten");
  });

  it("should use the singular and plural Klagende labels", () => {
    expect(getKlagendeText(1)).toBe("die Klagende");
    expect(getKlagendeText(2)).toBe("die Klagenden");
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
      "Die Beklagten zu 1), zu 2) werden als Gesamtschuldner verurteilt, die Klagende zu 2) Mahnkosten in Höhe von 25 nebst Zinsen in Höhe von 5 Prozent p. a. seit dem 01.02.2024 zu zahlen.",
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
      "Es wird festgestellt, dass sich die beklagte 2) mit der Annahme der im Antrag zu 2) genannten Gegenleistung seit dem 03.04.2025 in Annahmeverzug befindet.",
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
      "Es wird festgestellt, dass sich die beklagten 1), zu 2) mit der Annahme der im Antrag zu 1) genannten Gegenleistung in Annahmeverzug befinden.",
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
      "Die Beklagte zu 1) wird verurteilt, die Klagende zu 1) Inkassokosten in Höhe von 12 nebst Zinsen in Höhe von 3 Prozent p. a. seit dem 01.01.2025 zu zahlen.",
    );
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
      "Die Beklagte 1) wird verurteilt, die Klagende 1) einen Betrag in Höhe von 125,50 Euro nebst Zinsen in Höhe von 5 Prozent p. a. seit dem 01.02.2024, Zug-um-Zug gegen: Rückgabe der Sache.",
    );
  });
});
