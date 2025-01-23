import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import {
  prozesskostenhilfeFormular,
  type ProzesskostenhilfeFormularContext,
} from "~/domains/prozesskostenhilfe/formular";
import { happyPathData } from "~/domains/prozesskostenhilfe/formular/__test__/prozesskostenhilfeFormularData";
import { antragstellendePersonTransitionCases } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/__test__/testcases";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { testCasesPKHFormularFinanzielleAngabenAndereUnterhaltszahlungen } from "../finanzielleAngaben/__test__/testcasesAndereUnterhalt";
import { testCasesPKHFormularFinanzielleAngabenAusgaben } from "../finanzielleAngaben/__test__/testcasesAusgaben";
import { testCasesPKHFormularFinanzielleAngabenEigentum } from "../finanzielleAngaben/__test__/testcasesEigentum";
import { testCasesPKHFormularFinanzielleAngabenEinkuenfte } from "../finanzielleAngaben/__test__/testcasesEinkuenfte";
import { testCasesPKHFormularFinanzielleAngabenKinder } from "../finanzielleAngaben/__test__/testcasesKinder";
import { testCasesPKHFormularFinanzielleAngabenPartner } from "../finanzielleAngaben/__test__/testcasesPartner";
import { testCasesPKHFormularFinanzielleAngabenWohnung } from "../finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesProzesskostenhilfeRsv } from "../rechtsschutzversicherung/__test__/testcases";

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
  [{}, ["/persoenliche-daten/beruf", "/abgabe/ueberpruefung"]],
  ...antragstellendePersonTransitionCases,
  ...testCasesPKHFormularFinanzielleAngabenEinkuenfte,
  ...testCasesPKHFormularFinanzielleAngabenPartner,
  ...testCasesPKHFormularFinanzielleAngabenWohnung,
  ...testCasesPKHFormularFinanzielleAngabenKinder,
  ...testCasesPKHFormularFinanzielleAngabenAndereUnterhaltszahlungen,
  ...testCasesPKHFormularFinanzielleAngabenEigentum,
  ...testCasesPKHFormularFinanzielleAngabenAusgaben,
  ...testCasesProzesskostenhilfeRsv,
  [
    happyPathData,
    [
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
  ] satisfies TestCases<ProzesskostenhilfeFormularContext>,
};

export const testCasesProzesskostenhilfeFormular = {
  machine,
  cases,
};
