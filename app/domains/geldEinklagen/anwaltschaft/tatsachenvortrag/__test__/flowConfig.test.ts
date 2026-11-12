import { tatsachenvortragFlowConfig } from "../flowConfig";
import { tatsachenvortragPages } from "../pages";
import { compileFlow } from "~/services/flow/flowEngine/compileFlow";
import { createFlowSession } from "~/services/flow/flowEngine/createFlowSession";
import { runSimulation } from "~/services/flow/flowEngine/simulate";

const flow = compileFlow({
  pages: {
    ...tatsachenvortragPages,
    rechtlicheWuerdigung: { stepId: "/rechtliche-wuerdigung" },
  },
  initialStep: "antraegeUebersicht",
  transitions: {
    ...tatsachenvortragFlowConfig,
    rechtlicheWuerdigung: null,
  },
  pruningStrategy: "cascading",
});

const vortraege = [
  {
    antragId: "11111111-1111-4111-8111-111111111111",
    absaetze: [
      {
        formulierung: "Zahlungsantrag Absatz 1",
        beweise: [{ type: "urkunde" as const, beschreibung: "Vertrag" }],
      },
      { formulierung: "Zahlungsantrag Absatz 2" },
    ],
  },
  {
    antragId: "muendlicheVerhandlung",
    absaetze: [{ formulierung: "Prozessantrag Absatz 1" }],
  },
];

describe("Tatsachenvortrag Vorträge", () => {
  it("visits the Absätze of every Vortrag", () => {
    const simulation = runSimulation(
      { vortraege, pageData: { arrayIndexes: [] } },
      flow,
    );

    expect(
      simulation.visitedContexts
        .filter(({ key }) => key === "absatzDaten")
        .map(({ pageData, scopeData }) => ({
          indexes: pageData.arrayIndexes,
          formulierung: scopeData.formulierung,
        })),
    ).toEqual([
      { indexes: [0, 0], formulierung: "Zahlungsantrag Absatz 1" },
      { indexes: [0, 1], formulierung: "Zahlungsantrag Absatz 2" },
      { indexes: [1, 0], formulierung: "Prozessantrag Absatz 1" },
    ]);
  });

  it("keeps the Antrag link and Absätze when pruning", () => {
    const session = createFlowSession(
      flow,
      { vortraege, pageData: { arrayIndexes: [1] } },
      tatsachenvortragPages.absaetzeUebersicht.stepId,
    );

    expect(session.prunedUserData.vortraege).toEqual(vortraege);
  });

  it("returns from the Absätze overview to the Anträge overview", () => {
    const session = createFlowSession(
      flow,
      { vortraege, pageData: { arrayIndexes: [1] } },
      tatsachenvortragPages.absaetzeUebersicht.stepId,
    );

    expect(session.prevPath).toBe("/tatsachenvortrag-beweise/uebersicht");
  });
});
