import { type Hauptantrag } from "../../hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
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

const createHauptantrag = (
  absaetze: Hauptantrag["absaetze"],
  label = "1",
): Hauptantrag => ({
  betragForderung: "100",
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "" },
  zinsende: { day: "", month: "" },
  absaetze,
  nebenantrag: [
    {
      type: "nebenantrag",
      nebenantragArt: "mahnkosten",
      nebenantragBetrag: "10",
      nebenantragZinsbeginn: { day: "", month: "" },
      nebenantragZinsende: { day: "", month: "" },
      absaetze: [
        { formulierung: `Nebenantrag ${label} Absatz 1` },
        { formulierung: `Nebenantrag ${label} Absatz 2` },
      ],
    },
    {
      type: "annahmeverzug",
      annahmeverzugsFeststellung: "on",
      annahmeverzugDatum: { day: "", month: "" },
      absaetze: [{ formulierung: `Annahmeverzug ${label} Absatz 1` }],
    },
  ],
});

describe("Tatsachenvortrag nested paragraphs", () => {
  it.each([
    { absaetze: undefined },
    { absaetze: [] },
    { absaetze: [{ formulierung: "Hauptantrag Absatz 1" }] },
  ])(
    "keeps Nebenantrag paragraphs with Hauptantrag paragraphs $absaetze",
    ({ absaetze }) => {
      const userData = {
        hauptantrag: [
          createHauptantrag(absaetze, "2"),
          createHauptantrag(absaetze),
        ],
        pageData: { arrayIndexes: [1, 0] },
      };

      const simulation = runSimulation(userData, flow);
      expect(
        simulation.visitedContexts
          .filter(({ key }) => key === "nebenantragAbsatzDaten")
          .map(({ arrayPath, pageData, scopeData }) => ({
            arrayPath,
            indexes: pageData.arrayIndexes,
            formulierung: scopeData.formulierung,
          })),
      ).toEqual(
        userData.hauptantrag.flatMap((hauptantrag, hauptantragIndex) =>
          hauptantrag.nebenantrag?.flatMap((nebenantrag, nebenantragIndex) =>
            nebenantrag.absaetze?.map(({ formulierung }, absatzIndex) => ({
              arrayPath: ["hauptantrag", "nebenantrag", "absaetze"],
              indexes: [hauptantragIndex, nebenantragIndex, absatzIndex],
              formulierung,
            })),
          ),
        ),
      );

      const session = createFlowSession(
        flow,
        userData,
        tatsachenvortragPages.nebenantragAbsatzUebersicht.stepId,
      );
      expect(session.prunedUserData.hauptantrag).toEqual(
        userData.hauptantrag.map((hauptantrag) => ({
          ...(absaetze?.length ? { absaetze } : {}),
          nebenantrag: hauptantrag.nebenantrag?.map(({ absaetze }) => ({
            absaetze,
          })),
        })),
      );
    },
  );

  it.each([{ nebenantrag: undefined }, { nebenantrag: [] }])(
    "does not create phantom Nebenantrag contexts for $nebenantrag",
    ({ nebenantrag }) => {
      const simulation = runSimulation(
        {
          hauptantrag: [{ ...createHauptantrag(undefined), nebenantrag }],
          pageData: { arrayIndexes: [] },
        },
        flow,
      );

      expect(
        simulation.visitedContexts.filter(
          ({ key }) => key === "nebenantragAbsatzUebersicht",
        ),
      ).toEqual([]);
      expect(simulation.reachableSet.has("nebenantragAbsatzUebersicht")).toBe(
        true,
      );
    },
  );
});
