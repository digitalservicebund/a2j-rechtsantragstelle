import { machine } from "./testMachine";
import type { TestCases } from "./../TestCases";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";

const cases = [
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      beratungshilfeBeantragt: "no",
      // TODO Why is this called eigeninitiative? I believe it's rather "andereBeratungen" or something?
      eigeninitiativeGrundvorraussetzung: "no",
    },
    [
      "start",
      "grundvoraussetzungen/start",
      "grundvoraussetzungen/rechtsschutzversicherung",
      "grundvoraussetzungen/wurdeVerklagt",
      "grundvoraussetzungen/klageEingereicht",
      "grundvoraussetzungen/beratungshilfeBeantragt",
      "grundvoraussetzungen/eigeninitiativeGrundvorraussetzung",
      "anwaltlicheVertretung/start",
      "rechtsproblem/start",
      "rechtsproblem/bereich",
      "rechtsproblem/situation-beschreibung",
      "finanzielleAngaben/start",
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "persoenlicheDaten/start",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFormularContext>;

export const testCasesBeratungshilfeFormular = {
  machine,
  cases,
};
