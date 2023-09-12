/* eslint sonarjs/no-duplicate-string: 0 */
import { createMachine } from "xstate";
import { happyPathData } from "tests/fixtures/geldEinklagenVorabcheckData";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
import { guards } from "~/models/flows/geldEinklagen/guards";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import type { TestCases } from "../TestCases";

const machine = createMachine<GeldEinklagenVorabcheckContext>(
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
  [happyPathData, happyPathSteps],
] as const satisfies TestCases<GeldEinklagenVorabcheckContext>;

export const testCasesGeldEinklagen = { machine, cases };
