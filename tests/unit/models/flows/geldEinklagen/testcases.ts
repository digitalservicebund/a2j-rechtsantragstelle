import { createMachine } from "xstate";
import { happyPathData } from "tests/fixtures/geldEinklagenVorabcheckData";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
import { guards } from "~/models/flows/geldEinklagen/guards";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import type { TestCases } from "../flows.test";

const machine = createMachine<GeldEinklagenVorabcheckContext>(
  { ...geldEinklagenFlow, context: {}, predictableActionArguments: true },
  { guards }
);

const happyPathSteps = [
  "start",
  "kontaktaufnahme",
  "frist-abgelaufen",
  "verjaehrt",
  "beweise",
  "gerichtsentscheidung",
  "verfahren-begonnen",
  "privatperson",
  "wohnsitz-deutschland",
  "forderung",
  "bereich",
  "gegenseite",
  "gegenseite-person-deutschland",
  "ergebnis/abschluss",
];

const cases = [
  [{}, ["start", "kontaktaufnahme"]],
  [
    { kontaktaufnahme: "no" },
    ["kontaktaufnahme", "ergebnis/kontaktaufnahme-hinweis", "frist-abgelaufen"],
  ],
  [
    { fristAbgelaufen: "no" },
    ["frist-abgelaufen", "ergebnis/frist-abgelaufen-hinweis", "verjaehrt"],
  ],
  [
    { verjaehrt: "yes" },
    ["verjaehrt", "ergebnis/verjaehrt-hinweis", "beweise"],
  ],
  [
    { beweise: "no" },
    ["beweise", "ergebnis/beweise-hinweis", "gerichtsentscheidung"],
  ],
  [
    { gerichtsentscheidung: "yes" },
    [
      "gerichtsentscheidung",
      "ergebnis/gerichtsentscheidung-hinweis",
      "verfahren-begonnen",
    ],
  ],
  [
    { verfahrenBegonnen: "yes" },
    [
      "verfahren-begonnen",
      "ergebnis/verfahren-begonnen-hinweis",
      "privatperson",
    ],
  ],
  [
    { privatperson: "nonPrivate" },
    ["privatperson", "ergebnis/privatperson-abbruch"],
  ],
  [
    { wohnsitzDeutschland: "no" },
    ["wohnsitz-deutschland", "ergebnis/wohnsitz-deutschland-abbruch"],
  ],
  [{ forderung: "moreThan5000" }, ["forderung", "ergebnis/forderung-abbruch"]],
  [{ bereich: "family" }, ["bereich", "ergebnis/bereich-familie-abbruch"]],
  [{ bereich: "work" }, ["bereich", "ergebnis/bereich-arbeit-abbruch"]],
  [{ bereich: "travel" }, ["bereich", "flug"]],
  [
    { bereich: "travel", flug: "yes" },
    ["bereich", "flug", "ergebnis/flug-abbruch"],
  ],
  [
    { gegenseite: "staat" },
    ["gegenseite", "ergebnis/gegenseite-staat-abbruch"],
  ],
  [
    { gegenseite: "multiple" },
    ["gegenseite", "ergebnis/gegenseite-mehrere-abbruch"],
  ],
  [
    { gegenseite: "unternehmen" },
    ["gegenseite", "gegenseite-unternehmen-deutschland"],
  ],
  [
    { gegenseitePersonDeutschland: "no" },
    [
      "gegenseite-person-deutschland",
      "ergebnis/gegenseite-person-deutschland-abbruch",
    ],
  ],
  [
    {
      gegenseite: "unternehmen",
      gegenseiteUnternehmenDeutschland: "no",
    },
    [
      "gegenseite",
      "gegenseite-unternehmen-deutschland",
      "ergebnis/gegenseite-unternehmen-deutschland-abbruch",
    ],
  ],
  [happyPathData, happyPathSteps],
] as const satisfies TestCases<GeldEinklagenVorabcheckContext>;

export const testCasesGeldEinklagen = { machine, cases };
