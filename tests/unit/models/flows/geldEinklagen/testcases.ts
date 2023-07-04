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
  "gerichstkostenvorschuss",
  "kontaktaufnahme",
  "frist-abgelaufen",
  "privatperson",
  "bund-id-konto",
  "forderung",
  "bereich",
  "gegenseite",
  "gegenseite-person-deutschland",
  "ergebnis/abschluss",
];

const cases = [
  [{}, ["start", "gerichstkostenvorschuss"]],
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
    { bundIdAccount: "no" },
    ["bund-id-konto", "ergebnis/bund-id-konto-abbruch"],
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
