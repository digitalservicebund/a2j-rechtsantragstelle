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
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
      staatlicheLeistungen: "keine",
      einkommen: "100",
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
      "finanzielleAngaben/einkommen/erwerbstaetig",
      "finanzielleAngaben/einkommen/situation",
      "finanzielleAngaben/einkommen/weiteres-einkommen",
      "finanzielleAngaben/einkommen/einkommen",
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/kinder/kinder-frage",
      "finanzielleAngaben/andere-unterhaltszahlungen/frage",
      "finanzielleAngaben/eigentum/eigentum-info",
      "finanzielleAngaben/eigentum/bankkonten-frage",
      "finanzielleAngaben/eigentum/geldanlagen-frage",
      "finanzielleAngaben/eigentum/wertgegenstaende-frage",
      "finanzielleAngaben/eigentum/grundeigentum-frage",
      "finanzielleAngaben/eigentum/kraftfahrzeuge-frage",
      "finanzielleAngaben/eigentum/gesamtwert",
      "finanzielleAngaben/wohnung/wohnsituation",
      "finanzielleAngaben/wohnung/groesse",
      "finanzielleAngaben/ausgaben/ausgaben-frage",
      "persoenlicheDaten/start",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFormularContext>;

export const testCasesBeratungshilfeFormular = {
  machine,
  cases,
};
