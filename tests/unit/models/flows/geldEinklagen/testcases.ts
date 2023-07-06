import { createMachine } from "xstate";
import { happyPathData } from "tests/fixtures/geldEinklagenVorabcheckData";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
import { guards } from "~/models/flows/geldEinklagen/guards";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import type { TestCases } from "../flows.test";

const machine = createMachine<GeldEinklagenVorabcheckContext>(
  { ...geldEinklagenFlow, context: {} },
  { guards }
);

const happyPathSteps = [
  "start",
  "gerichtskostenvorschuss",
  "forderung",
  "bereich",
  "gegenseite",
  "kontaktaufnahme",
  "frist-abgelaufen",
  "privatperson",
  "bund-id-konto",
  "ergebnis/abschluss",
];

const cases = [
  [{}, ["start", "gerichtskostenvorschuss"]],
  [
    { gerichtskostenvorschuss: "no" },
    ["gerichtskostenvorschuss", "ergebnis/gerichtskostenvorschuss-abbruch"],
  ],
  [
    { gerichtskostenvorschuss: "notPossible" },
    [
      "gerichtskostenvorschuss",
      "ergebnis/gerichtskostenvorschuss-hinweis",
      "forderung",
    ],
  ],
  [{ forderung: "moreThan5000" }, ["forderung", "ergebnis/forderung-abbruch"]],
  [{ bereich: "work" }, ["bereich", "ergebnis/bereich-arbeit-abbruch"]],
  [{ bereich: "family" }, ["bereich", "ergebnis/bereich-familie-abbruch"]],
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
  [{ gegenseite: "unternehmen" }, ["gegenseite", "kontaktaufnahme"]],
  [
    { kontaktaufnahme: "no" },
    ["kontaktaufnahme", "ergebnis/kontaktaufnahme-hinweis", "frist-abgelaufen"],
  ],
  [
    { fristAbgelaufen: "no" },
    ["frist-abgelaufen", "ergebnis/frist-abgelaufen-hinweis", "privatperson"],
  ],
  [
    { privatperson: "nonPrivate" },
    ["privatperson", "ergebnis/privatperson-abbruch"],
  ],
  [
    { privatperson: "organisation" },
    ["privatperson", "ergebnis/privatperson-abbruch"],
  ],
  [{ privatperson: "nonSingle" }, ["privatperson", "bund-id-konto"]],
  [{ privatperson: "representing" }, ["privatperson", "bund-id-konto"]],
  [
    { bundIdAccount: "no" },
    ["bund-id-konto", "ergebnis/bund-id-konto-abbruch"],
  ],

  [happyPathData, happyPathSteps],
] as const satisfies TestCases<GeldEinklagenVorabcheckContext>;

export const testCasesGeldEinklagen = { machine, cases };
