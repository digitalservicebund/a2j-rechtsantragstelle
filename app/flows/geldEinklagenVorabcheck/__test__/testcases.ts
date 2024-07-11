/* eslint sonarjs/no-duplicate-string: 0 */
import { createMachine } from "xstate";
import { happyPathData } from "tests/fixtures/geldEinklagenVorabcheckData";
import type { TestCases } from "~/flows/__test__/TestCases";
import geldEinklagenFlow from "~/flows/geldEinklagenVorabcheck/config.json";
import type { GeldEinklagenVorabcheckContext } from "~/flows/geldEinklagenVorabcheck/context";
import { guards } from "~/flows/geldEinklagenVorabcheck/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...geldEinklagenFlow, context: {} },
  { guards },
);

const happyPathSteps = [
  "start",
  "forderung",
  "geldspanne",
  "gerichtskostenvorschuss",
  "bereich",
  "privatperson",
  "gegenseite",
  "gegenseite-person-deutschland",
];

const cases = [
  [{}, ["start", "forderung"]],
  [{ forderung: "action" }, ["forderung", "ergebnis/forderung-abbruch"]],
  [{ geldspanne: "above_5000" }, ["geldspanne", "ergebnis/geldspanne-abbruch"]],
  [{ bereich: "work" }, ["bereich", "ergebnis/bereich-arbeit-abbruch"]],
  [{ bereich: "family" }, ["bereich", "ergebnis/bereich-familie-abbruch"]],
  [{ bereich: "travel" }, ["bereich", "flug"]],
  [
    { gegenseite: "multiple" },
    ["gegenseite", "ergebnis/gegenseite-mehrere-abbruch"],
  ],
  [
    { gegenseite: "unternehmen" },
    ["gegenseite", "gegenseite-unternehmen-deutschland"],
  ],
  [
    { privatperson: "nonPrivate" },
    ["privatperson", "ergebnis/privatperson-abbruch"],
  ],
  [
    { privatperson: "organisation" },
    ["privatperson", "ergebnis/privatperson-abbruch"],
  ],
  [{ privatperson: "nonSingle" }, ["privatperson", "gegenseite"]],
  [{ privatperson: "representing" }, ["privatperson", "gegenseite"]],
  [
    { gegenseiteKontakt: "no" },
    ["gegenseite-kontakt", "eigeninitiative-warnung", "gegenseite-frist"],
  ],
  [{ gegenseiteKontakt: "yes" }, ["gegenseite-kontakt", "gegenseite-frist"]],
  [{ gegenseiteFrist: "yes" }, ["gegenseite-frist", "digital-ausweisen"]],
  [
    { gegenseiteFrist: "no" },
    ["gegenseite-frist", "frist-warnung", "digital-ausweisen"],
  ],
  [happyPathData, happyPathSteps],
] as const satisfies TestCases<GeldEinklagenVorabcheckContext>;

export const testCasesGeldEinklagen = { machine, cases };
