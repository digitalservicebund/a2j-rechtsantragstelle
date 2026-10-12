import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { prozesskostenhilfeFormularFlowConfig } from "../flowConfig";
import {
  testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung,
  testCasesPKHFormularAntragstellendePersonVereinfachteErklaerungTransitions,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/__test__/testcases";
import { testCasesPKHFormularFinanzielleAngabenAndereUnterhaltszahlungen } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesAndereUnterhalt";
import { testCasesPKHFormularFinanzielleAngabenEigentum } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesEigentum";
import { testCasesPKHFormularFinanzielleAngabenEinkuenfte } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesEinkuenfte";
import { testCasesPKHFormularFinanzielleAngabenKinder } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesKinder";
import { testCasesPKHFormularFinanzielleAngabenPartner } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesPartner";
import { testCasesPKHFormularFinanzielleAngabenWohnung } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesWohnung";
import { testCasesPKHFormularGrundvoraussetzungen } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/__test__/testcases";
import { testCasesPKHFormularPersoenlicheDaten } from "~/domains/prozesskostenhilfe/formular/persoenlicheDaten/__test__/testcases";
import { testCasesPKHFormularRsv } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/__test__/testcases";
import { testCasesPKHFormularFinanzielleAngabenAbzuege } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/__test__/testcases";
import { testCasesPKHFormularFinanzielleAngabenAusgaben } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/__test__/testcasesAusgaben";
import { testCasesPKHFormularFinanzielleAngabenGesetzlicheVertretung } from "../gesetzlicheVertretung/__test__/testcases";
import { testCasesPKHFormularWeitereAngaben } from "../weitereAngaben/__tests__/testcases";
import { testCasesPKHFormularAntragstellendePersonTransitions } from "../antragstellendePerson/__test__/testcases";

export const prozesskostenhilfeFormularTestCases = {
  xstateConfig: { id: "/prozesskostenhilfe/formular" },
  newEngineConfig: prozesskostenhilfeFormularFlowConfig,
  testcases: {
    ...testCasesPKHFormularGrundvoraussetzungen,
    ...testCasesPKHFormularAntragstellendePersonTransitions,
    ...testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung,
    ...testCasesPKHFormularAntragstellendePersonVereinfachteErklaerungTransitions,
    ...testCasesPKHFormularRsv,
    ...testCasesPKHFormularFinanzielleAngabenEinkuenfte,
    ...testCasesPKHFormularFinanzielleAngabenPartner,
    ...testCasesPKHFormularFinanzielleAngabenAbzuege,
    ...testCasesPKHFormularFinanzielleAngabenKinder,
    ...testCasesPKHFormularFinanzielleAngabenAndereUnterhaltszahlungen,
    ...testCasesPKHFormularFinanzielleAngabenWohnung,
    ...testCasesPKHFormularFinanzielleAngabenEigentum,
    ...testCasesPKHFormularFinanzielleAngabenAusgaben,
    ...testCasesPKHFormularFinanzielleAngabenGesetzlicheVertretung,
    ...testCasesPKHFormularPersoenlicheDaten,
    ...testCasesPKHFormularWeitereAngaben,
  },
} satisfies FlowTestConfig<
  ProzesskostenhilfeFormularUserData,
  typeof prozesskostenhilfeFormularFlowConfig.pages
>;
