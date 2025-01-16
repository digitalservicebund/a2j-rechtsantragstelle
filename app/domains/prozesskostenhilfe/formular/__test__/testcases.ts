import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import {
  prozesskostenhilfeFormular,
  type ProzesskostenhilfeFormularContext,
} from "~/domains/prozesskostenhilfe/formular";
import { happyPathData } from "~/domains/prozesskostenhilfe/formular/__test__/prozesskostenhilfeFormularData";
import { antragstellendePersonTransitionCases } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/__test__/testcases";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { testCasesPKHFormularFinanzielleAngabenEinkuenfte } from "../finanzielleAngaben/__test__/testcasesEinkuenfte";
import { testCasesPKHFormularFinanzielleAngabenWohnung } from "../finanzielleAngaben/__test__/testcasesWohnung";

export const machine: FlowStateMachine = createMachine(
  { ...prozesskostenhilfeFormular.config, context: {} },
  { guards: prozesskostenhilfeFormular.guards },
);

const cases = [
  [
    {
      formularArt: "erstantrag",
      verfahrenArt: "verfahrenSelbststaendig",
      versandArt: "digital",
    },
    [
      "/start/start",
      "/grundvoraussetzungen/nachueberpruefung-frage",
      "/grundvoraussetzungen/antrag/klageersteller",
      "/grundvoraussetzungen/antrag/hinweis",
      "/grundvoraussetzungen/einreichung/fall",
      "/grundvoraussetzungen/einreichung/mjp",
      "/grundvoraussetzungen/einreichung/hinweis-digital-einreichung",
    ],
  ],
  [
    {
      formularArt: "nachueberpruefung",
      versandArt: "analog",
    },
    [
      "/grundvoraussetzungen/nachueberpruefung-frage",
      "/grundvoraussetzungen/nachueberpruefung/name-gericht",
      "/grundvoraussetzungen/nachueberpruefung/aktenzeichen",
      "/grundvoraussetzungen/einreichung/fall",
      "/grundvoraussetzungen/einreichung/hinweis-papier-einreichung",
      "/antragstellende-person/empfaenger",
    ],
  ],
  [
    { partnerschaft: "separated" },
    [
      "/finanzielle-angaben/partner/partnerschaft",
      "/finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      zusammenleben: "yes",
      partnerEinkommen: "yes",
      "partner-staatlicheLeistungen": "keine",
      "partner-currentlyEmployed": "yes",
      "partner-employmentType": "employed",
      "partner-nettoEinkuenfteAlsArbeitnehmer": "1000",
      "partner-arbeitsweg": "none",
      "partner-hasArbeitsausgaben": "no",
      "partner-receivesPension": "no",
      "partner-receivesSupport": "no",
      "partner-hasFurtherIncome": "no",
      partnerHasBesondersAusgaben: "no",
    },
    [
      "/finanzielle-angaben/partner/partnerschaft",
      "/finanzielle-angaben/partner/zusammenleben",
      "/finanzielle-angaben/partner/partner-einkommen",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-erwerbstaetig",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-art",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-netto-einkommen",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsweg",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-rente-frage",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt-frage",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-frage",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-frage",
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-besonders-ausgaben",
      "/finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  ...antragstellendePersonTransitionCases,
  ...testCasesPKHFormularFinanzielleAngabenEinkuenfte,
  ...testCasesPKHFormularFinanzielleAngabenWohnung,
  [
    happyPathData,
    [
      "/finanzielle-angaben/partner/partnerschaft",
      "/finanzielle-angaben/partner/zusammenleben",
      "/finanzielle-angaben/partner/partner-einkommen",
      "/finanzielle-angaben/kinder/kinder-frage",
      "/finanzielle-angaben/kinder/uebersicht",
      "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      "/finanzielle-angaben/wohnung/alleine-zusammen",
      "/finanzielle-angaben/wohnung/groesse",
      "/finanzielle-angaben/wohnung/anzahl-zimmer",
      "/finanzielle-angaben/wohnung/miete-eigenheim",
      "/finanzielle-angaben/wohnung/miete-alleine",
      "/finanzielle-angaben/wohnung/nebenkosten",
      "/finanzielle-angaben/eigentum/eigentum-info",
      "/finanzielle-angaben/eigentum/heirat-info",
      "/finanzielle-angaben/eigentum/bankkonten-frage",
      "/finanzielle-angaben/eigentum/geldanlagen-frage",
      "/finanzielle-angaben/eigentum/wertgegenstaende-frage",
      "/finanzielle-angaben/eigentum/grundeigentum-frage",
      "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
      "/finanzielle-angaben/ausgaben/besondere-belastungen",
      "/finanzielle-angaben/ausgaben-zusammenfassung/zusammenfassung",
      "/gesetzliche-vertretung/frage",
      "/gesetzliche-vertretung/daten",
      "/persoenliche-daten/start",
      "/persoenliche-daten/name",
      "/persoenliche-daten/geburtsdatum",
      "/persoenliche-daten/adresse",
      "/persoenliche-daten/telefonnummer",
      "/persoenliche-daten/beruf",
      "/abgabe/ende",
    ],
  ],
] satisfies TestCases<ProzesskostenhilfeFormularContext>;

export const testCasesProzesskostenhilfeFormular = {
  machine,
  cases,
};
