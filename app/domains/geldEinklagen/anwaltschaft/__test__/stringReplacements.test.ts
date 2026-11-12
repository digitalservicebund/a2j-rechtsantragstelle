import { type GeldEinklagenAnwaltschaftUserData } from "../userData";
import { getAntraegeStrings } from "../stringReplacements";

const userData = {
  hauptantrag: [
    { id: "z1", internesSchlagwortForderung: "Miete" },
    { id: "z2", nebenantraege: [{ id: "n1" }] },
  ],
  schmerzengeldantrag: [{ id: "s1", internesSchlagwortForderung: "Unfall" }],
  vortraege: [{ antragId: "s1" }],
} as unknown as GeldEinklagenAnwaltschaftUserData;

const zahlung =
  "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege";
const schmerzensgeld =
  "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege";

describe("getAntraegeStrings", () => {
  it.each([
    [
      `${zahlung}/hauptantrag/#/daten`,
      [0],
      "Bezifferter Zahlungsantrag 1 (Miete)",
    ],
    [
      `${zahlung}/#/nebenantraege/#/daten`,
      [1, 0],
      "Bezifferter Zahlungsantrag 2",
    ],
    [
      `${zahlung}/#/annahmeverzug/#/daten`,
      [1, 1],
      "Bezifferter Zahlungsantrag 2",
    ],
    [
      `${schmerzensgeld}/schmerzensgeldantraege/#/daten`,
      [0],
      "Unbezifferter Schmerzensgeldantrag 3 (Unfall)",
    ],
    // A new Schmerzensgeldantrag that isn't saved yet
    [
      `${schmerzensgeld}/schmerzensgeldantraege/#/daten`,
      [1],
      "Unbezifferter Schmerzensgeldantrag 4",
    ],
    [
      `${schmerzensgeld}/#/nebenantraege/#/daten`,
      [0, 0],
      "Unbezifferter Schmerzensgeldantrag 3 (Unfall)",
    ],
    [
      "/tatsachenvortrag-beweise/vortraege/#/absaetze",
      [0],
      "Unbezifferter Schmerzensgeldantrag 3 (Unfall)",
    ],
  ])("titles %s with %j as %s", (stepId, arrayIndexes, antragTitle) => {
    expect(getAntraegeStrings(userData, stepId, arrayIndexes)).toMatchObject({
      antragTitle,
    });
  });

  it("does not set an antragTitle on unrelated array pages", () => {
    expect(
      getAntraegeStrings(userData, "/klagende-partei/klagenden/#/daten", [0]),
    ).toEqual({ keineAntraege: false });
  });
});
