import { getBeweisCategory, getOrderedAbsaetze } from "../beweisOrdering";
import type { Absatz, Beweis } from "../tatsachenvortragSchemas";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import type { Nebenantrag } from "../../hauptUndNebenantraege/hauptUndNebenantraegeSchemas";

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
  absaetze: Absatz[] = [],
  nebenantraege: Nebenantrag[] = [],
): NonNullable<GeldEinklagenAnwaltschaftUserData["hauptantrag"]>[number] => ({
  betragForderung: "100",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "" },
  zinsende: { day: "", month: "" },
  absaetze,
  nebenantraege,
});

describe("getOrderedAbsaetze", () => {
  it("numbers all document types across Haupt- and Nebenantraege in document order", () => {
    const userData = {
      hauptantrag: [
        hauptantrag(
          [
            absatz([
              { type: "parteivernehmung", personen: {} },
              document("first"),
              { type: "augenschein", beschreibung: "Photo" },
              { type: "sachverstaendigengutachten", beschreibung: "Report" },
            ]),
            absatz(),
            absatz([]),
            absatz([{ type: "parteivernehmung", personen: {} }]),
            absatz([document("fourth")]),
          ],
          [
            {
              type: "nebenantrag",
              nebenantragArt: "mahnkosten",
              nebenantragBetrag: "10",
              absaetze: [absatz([document("fifth")])],
            },
            {
              type: "annahmeverzug",
              annahmeverzugsFeststellung: "on",
              annahmeverzugDatum: { day: "", month: "" },
              absaetze: [absatz([document("sixth")])],
            },
          ],
        ),
        hauptantrag(),
        hauptantrag([absatz([document("seventh")])]),
      ],
    };
    const original = structuredClone(userData);

    const ordered = getOrderedAbsaetze(userData);

    expect(
      ordered.map((item) => ({
        path: [
          item.hauptantragArrayIndex,
          item.nebenantragArrayIndex,
          item.absatzArrayIndex,
        ],
        documents: item.beweise
          .filter(({ documentNumber }) => documentNumber !== undefined)
          .map(({ documentNumber }) => documentNumber),
      })),
    ).toEqual([
      { path: [0, undefined, 0], documents: [1, 2, 3] },
      { path: [0, undefined, 1], documents: [] },
      { path: [0, undefined, 2], documents: [] },
      { path: [0, undefined, 3], documents: [] },
      { path: [0, undefined, 4], documents: [4] },
      { path: [0, 0, 0], documents: [5] },
      { path: [0, 1, 0], documents: [6] },
      { path: [2, undefined, 0], documents: [7] },
    ]);
    expect(ordered[0].beweise.map(({ sourceIndex }) => sourceIndex)).toEqual([
      1, 2, 3, 0,
    ]);
    expect(ordered[0].beweise.at(-1)?.documentNumber).toBeUndefined();
    expect(userData).toEqual(original);
  });

  it("recalculates after evidence, paragraph and Antrag additions/deletions without changing IDs", () => {
    const first = document("first");
    const second = document("second");
    const last = document("last");
    const userData = {
      hauptantrag: [
        hauptantrag([absatz([first, second])]),
        hauptantrag([absatz([last])]),
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
      ["last", 3],
    ]);
    userData.hauptantrag[0].absaetze?.[0].beweise?.splice(0, 1);
    expect(numbers()).toEqual([
      ["second", 1],
      ["last", 2],
    ]);
    userData.hauptantrag[0].absaetze?.unshift(absatz([first]));
    expect(numbers()).toEqual([
      ["first", 1],
      ["second", 2],
      ["last", 3],
    ]);
    userData.hauptantrag[0].absaetze?.splice(0, 1);
    expect(numbers()).toEqual([
      ["second", 1],
      ["last", 2],
    ]);
    userData.hauptantrag.shift();
    expect(numbers()).toEqual([["last", 1]]);
    userData.hauptantrag.unshift(hauptantrag([absatz([first])]));
    expect(numbers()).toEqual([
      ["first", 1],
      ["last", 2],
    ]);
    expect(last.id).toBe("last");
  });

  it("handles absent paragraph arrays and evidence without persistent IDs", () => {
    expect(getOrderedAbsaetze({})).toEqual([]);
    const draft: Beweis = { type: "urkunde", beschreibung: "Draft" };
    const userData = {
      hauptantrag: [
        {
          ...hauptantrag(),
          absaetze: undefined,
          nebenantraege: [
            {
              type: "nebenantrag" as const,
              nebenantragArt: "mahnkosten" as const,
              nebenantragBetrag: "10",
            },
          ],
        },
        hauptantrag([absatz([draft])]),
      ],
    };
    expect(getOrderedAbsaetze(userData)[0].beweise).toEqual([
      { beweis: draft, sourceIndex: 0, documentNumber: 1 },
    ]);
    expect(draft.id).toBeUndefined();
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
