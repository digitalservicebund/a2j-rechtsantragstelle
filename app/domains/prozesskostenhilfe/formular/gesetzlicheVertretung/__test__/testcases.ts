import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { finanzielleAngabenTestcaseData } from "../../finanzielleAngaben/__test__/testcasesData";

export const testCasesPKHFormularFinanzielleAngabenGesetzlicheVertretung = {
  hasGesetzlicheVertretung: [
    {
      stepId: "/gesetzliche-vertretung/frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId: "/gesetzliche-vertretung/daten",
      userInput: {
        gesetzlicheVertretungDaten: {
          vorname: "Max",
          nachname: "Mustermann",
          strasseHausnummer: "Musterstraße 1",
          plz: "10969",
          ort: "Musterstadt",
          telefonnummer: "0123456789",
        },
      },
    },
    {
      stepId: "/persoenliche-daten/start",
    },
  ],
  noGesetzlicheVertretung: [
    {
      stepId: "/gesetzliche-vertretung/frage",
      userInput: {
        hasGesetzlicheVertretung: "no",
      },
    },
    {
      stepId: "/persoenliche-daten/start",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
