import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { prozesskostenhilfeFormular } from "~/domains/prozesskostenhilfe/formular";
import { happyPathData } from "~/domains/prozesskostenhilfe/formular/__test__/prozesskostenhilfeFormularData";
import { antragstellendePersonTransitionCases } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/__test__/testcases";
import {
  testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung,
  testCasesPKHFormularAntragstellendePersonVereinfachteErklaerungTransitions,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/__test__/testcases";
import { testCasesPKHFormularGrundvoraussetzungen } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/__test__/testcases";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { testCasesPKHFormularFinanzielleAngabenAndereUnterhaltszahlungen } from "../finanzielleAngaben/__test__/testcasesAndereUnterhalt";
import { testCasesPKHFormularFinanzielleAngabenAusgaben } from "../finanzielleAngaben/__test__/testcasesAusgaben";
import { testCasesPKHFormularFinanzielleAngabenEigentum } from "../finanzielleAngaben/__test__/testcasesEigentum";
import { testCasesPKHFormularFinanzielleAngabenEinkuenfte } from "../finanzielleAngaben/__test__/testcasesEinkuenfte";
import { testCasesPKHFormularFinanzielleAngabenKinder } from "../finanzielleAngaben/__test__/testcasesKinder";
import { testCasesPKHFormularFinanzielleAngabenPartner } from "../finanzielleAngaben/__test__/testcasesPartner";
import { testCasesPKHFormularFinanzielleAngabenWohnung } from "../finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesProzesskostenhilfePersoenlicheDaten } from "../persoenlicheDaten/__test__/testcases";
import { testCasesProzesskostenhilfeRsv } from "../rechtsschutzversicherung/__test__/testcases";
import { type ProzesskostenhilfeFormularUserData } from "../userData";

const machine: FlowStateMachine = createMachine(
  { ...prozesskostenhilfeFormular.config, context: {} },
  { guards: prozesskostenhilfeFormular.guards },
);

const testCasesFormular = [
  ...testCasesPKHFormularGrundvoraussetzungen,
  [
    {},
    ["/persoenliche-daten/beruf", "/weitere-angaben", "/abgabe/ueberpruefung"],
  ],
  ...antragstellendePersonTransitionCases,
  ...testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung,
  ...testCasesPKHFormularAntragstellendePersonVereinfachteErklaerungTransitions,
  ...testCasesPKHFormularFinanzielleAngabenEinkuenfte,
  ...testCasesPKHFormularFinanzielleAngabenPartner,
  ...testCasesPKHFormularFinanzielleAngabenWohnung,
  ...testCasesPKHFormularFinanzielleAngabenKinder,
  ...testCasesPKHFormularFinanzielleAngabenAndereUnterhaltszahlungen,
  ...testCasesPKHFormularFinanzielleAngabenEigentum,
  ...testCasesPKHFormularFinanzielleAngabenAusgaben,
  ...testCasesProzesskostenhilfeRsv,
  // ...testCasesProzesskostenhilfeDocumentUploadTransitions, // Uncomment when file upload is released
  [
    happyPathData,
    [
      "/gesetzliche-vertretung/frage",
      "/gesetzliche-vertretung/daten",
      "/persoenliche-daten/start",
      "/persoenliche-daten/name",
      "/persoenliche-daten/geburtsdatum",
      "/persoenliche-daten/plz",
      "/persoenliche-daten/adresse",
      "/persoenliche-daten/telefonnummer",
      "/persoenliche-daten/beruf",
      "/weitere-angaben",
      "/abgabe/ende",
    ],
  ],
] satisfies TestCases<ProzesskostenhilfeFormularUserData>;

export const testCasesProzesskostenhilfeSubmitOnly = {
  machine,
  cases: [
    [
      {},
      [
        "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe/daten",
        "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/einkunft/daten",
        "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe/partner-daten",
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe/partner-daten",
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-einkunft/partner-daten",
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/andere-unterhaltszahlungen/person/daten",
        "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
        "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/eigentum-zusammenfassung/wertgegenstaende/daten",
        "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      ],
    ],
  ] satisfies TestCases<ProzesskostenhilfeFormularUserData>,
};

const cases = [
  ...testCasesFormular,
  ...testCasesProzesskostenhilfePersoenlicheDaten,
];

export const testCasesProzesskostenhilfeFormular = {
  machine,
  cases,
};
