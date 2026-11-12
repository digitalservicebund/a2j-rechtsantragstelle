import { getBeweisCategory, getOrderedAbsaetze } from "../beweisOrdering";
import type { Absatz, Beweis } from "../tatsachenvortragSchemas";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";

type UserData = GeldEinklagenAnwaltschaftUserData;

const document = (id: string): Beweis => ({
  id,
  type: "urkunde",
  beschreibung: id,
});
const absatz = (beweise?: Beweis[]): Absatz => ({
  formulierung: "Sachverhalt",
  beweise,
});
const hauptantrag = (
  id: string,
  nebenantraege: NonNullable<UserData["hauptantrag"]>[number]["nebenantraege"] = [],
): NonNullable<UserData["hauptantrag"]>[number] => ({
  id,
  betragForderung: "100",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "" },
  zinsende: { day: "", month: "" },
  nebenantraege,
});

const documentNumbers = (userData: UserData) =>
  getOrderedAbsaetze(userData).map((item) => ({
    antragId: item.antrag.antragId,
    absatz: item.absatzArrayIndex,
    documents: item.beweise
      .filter(({ documentNumber }) => documentNumber !== undefined)
      .map(({ documentNumber }) => documentNumber),
  }));

describe("getOrderedAbsaetze", () => {
  it("numbers documents across all Anträge in Klageschrift order, regardless of Vortrag order", () => {
    const userData: UserData = {
      hauptantrag: [
        hauptantrag("zahlung", [
          {
            id: "zahlung-neben",
            type: "nebenantrag",
            nebenantragArt: "mahnkosten",
            nebenantragBetrag: "10",
          },
        ]),
      ],
      schmerzengeldantrag: [
        {
          id: "schmerz",
          mindestBetrag: "100",
          klagende: {},
          beklagte: {},
          zinsbeginn: { day: "", month: "" },
          zinsende: { day: "", month: "" },
          nebenantraege: [
            {
              id: "schmerz-neben",
              schmerzengeldNebenantragArt: "mahnkosten",
              schmerzengeldNebenantragBetrag: "10",
            },
          ],
        },
      ],
      muendlicheVerhandlung: "on",
      sonstigeAntraege: [{ id: "sonstig", antrag: "Antrag" }],
      // Deliberately stored in reverse order of the Klageschrift.
      vortraege: [
        { antragId: "sonstig", absaetze: [absatz([document("k7")])] },
        {
          antragId: "muendlicheVerhandlung",
          absaetze: [absatz([document("k6")])],
        },
        { antragId: "schmerz-neben", absaetze: [absatz([document("k5")])] },
        { antragId: "schmerz", absaetze: [absatz([document("k4")])] },
        {
          antragId: "zahlung-neben",
          absaetze: [absatz([document("k3")])],
        },
        {
          antragId: "zahlung",
          absaetze: [
            absatz([
              { type: "parteivernehmung", personen: {} },
              document("k1"),
            ]),
            absatz(),
            absatz([document("k2")]),
          ],
        },
      ],
    };
    const original = structuredClone(userData);

    expect(documentNumbers(userData)).toEqual([
      { antragId: "zahlung", absatz: 0, documents: [1] },
      { antragId: "zahlung", absatz: 1, documents: [] },
      { antragId: "zahlung", absatz: 2, documents: [2] },
      { antragId: "zahlung-neben", absatz: 0, documents: [3] },
      { antragId: "schmerz", absatz: 0, documents: [4] },
      { antragId: "schmerz-neben", absatz: 0, documents: [5] },
      { antragId: "muendlicheVerhandlung", absatz: 0, documents: [6] },
      { antragId: "sonstig", absatz: 0, documents: [7] },
    ]);
    const [first] = getOrderedAbsaetze(userData);
    expect(first.vortragArrayIndex).toBe(5);
    expect(first.beweise.map(({ sourceIndex }) => sourceIndex)).toEqual([
      1, 0,
    ]);
    expect(userData).toEqual(original);
  });

  it("skips Vorträge whose Antrag no longer exists and renumbers", () => {
    const userData: UserData = {
      hauptantrag: [hauptantrag("a"), hauptantrag("b")],
      vortraege: [
        { antragId: "a", absaetze: [absatz([document("first")])] },
        { antragId: "b", absaetze: [absatz([document("second")])] },
      ],
    };
    const numbers = () =>
      getOrderedAbsaetze(userData).flatMap(({ beweise }) =>
        beweise.map(({ beweis, documentNumber }) => [
          beweis.id,
          documentNumber,
        ]),
      );

    expect(numbers()).toEqual([
      ["first", 1],
      ["second", 2],
    ]);
    userData.hauptantrag?.shift();
    expect(numbers()).toEqual([["second", 1]]);
  });

  it("ignores unchecked Prozessanträge and Anträge without ID", () => {
    expect(getOrderedAbsaetze({})).toEqual([]);
    const userData: UserData = {
      hauptantrag: [{ ...hauptantrag("x"), id: "" }],
      muendlicheVerhandlung: "off",
      vortraege: [
        { antragId: "muendlicheVerhandlung", absaetze: [absatz()] },
        { antragId: "", absaetze: [absatz()] },
      ],
    };
    expect(getOrderedAbsaetze(userData)).toEqual([]);
  });
});

describe("getBeweisCategory", () => {
  it.each([
    ["augenschein", "document"],
    ["urkunde", "document"],
    ["sachverstaendigengutachten", "document"],
    ["zeuge", "person"],
    ["parteivernehmung", "person"],
  ] as const)("categorizes %s", (type, category) => {
    expect(getBeweisCategory(type)).toBe(category);
  });
});
