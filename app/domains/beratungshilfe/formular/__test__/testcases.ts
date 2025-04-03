import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { config } from "~/services/env/env.server";
import { machine } from "./testMachine";

const showZusammenfassungPage = config().ENVIRONMENT !== "production";

const cases = [
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      hamburgOderBremen: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
    },
    [
      "/start/start",
      "/grundvoraussetzungen/start",
      "/grundvoraussetzungen/rechtsschutzversicherung",
      "/grundvoraussetzungen/wurde-verklagt",
      "/grundvoraussetzungen/klage-eingereicht",
      "/grundvoraussetzungen/hamburg-oder-bremen",
      "/grundvoraussetzungen/beratungshilfe-beantragt",
      "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung",
      "/anwaltliche-vertretung/start",
      "/rechtsproblem/start",
      "/rechtsproblem/bereich",
      "/rechtsproblem/situation-beschreibung",
      "/finanzielle-angaben/einkommen/start",
      "/finanzielle-angaben/einkommen/staatliche-leistungen",
      "/persoenliche-daten/start",
      "/persoenliche-daten/name",
      "/persoenliche-daten/geburtsdatum",
      "/persoenliche-daten/adresse",
      "/persoenliche-daten/telefonnummer",
      showZusammenfassungPage
        ? "/zusammenfassung/ueberblick"
        : "/abgabe/ueberpruefung",
    ],
  ],
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      hamburgOderBremen: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
      staatlicheLeistungen: "keine",
      einkommen: "100",
    },
    [
      "/start/start",
      "/grundvoraussetzungen/start",
      "/grundvoraussetzungen/rechtsschutzversicherung",
      "/grundvoraussetzungen/wurde-verklagt",
      "/grundvoraussetzungen/klage-eingereicht",
      "/grundvoraussetzungen/hamburg-oder-bremen",
      "/grundvoraussetzungen/beratungshilfe-beantragt",
      "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung",
      "/anwaltliche-vertretung/start",
      "/rechtsproblem/start",
      "/rechtsproblem/bereich",
      "/rechtsproblem/situation-beschreibung",
      "/finanzielle-angaben/einkommen/start",
      "/finanzielle-angaben/einkommen/staatliche-leistungen",
      "/finanzielle-angaben/einkommen/erwerbstaetig",
      "/finanzielle-angaben/einkommen/situation",
      "/finanzielle-angaben/einkommen/weiteres-einkommen",
      "/finanzielle-angaben/einkommen/einkommen",
      "/finanzielle-angaben/partner/partnerschaft",
      "/finanzielle-angaben/kinder/kinder-frage",
      "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "/finanzielle-angaben/wohnung/wohnsituation",
      "/finanzielle-angaben/wohnung/groesse",
      "/finanzielle-angaben/eigentum/eigentum-info",
      "/finanzielle-angaben/eigentum/bankkonten-frage",
      "/finanzielle-angaben/eigentum/geldanlagen-frage",
      "/finanzielle-angaben/eigentum/wertgegenstaende-frage",
      "/finanzielle-angaben/eigentum/grundeigentum-frage",
      "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
      "/persoenliche-daten/start",
      "/persoenliche-daten/name",
      "/persoenliche-daten/geburtsdatum",
      "/persoenliche-daten/adresse",
      "/persoenliche-daten/telefonnummer",
      showZusammenfassungPage
        ? "/zusammenfassung/ueberblick"
        : "/abgabe/ueberpruefung",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFormularContext>;

export const testCasesBeratungshilfeFormular = {
  machine,
  cases,
};
