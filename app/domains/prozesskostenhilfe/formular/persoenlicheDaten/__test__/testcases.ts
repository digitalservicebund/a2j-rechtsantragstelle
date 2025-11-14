import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfePersoenlicheDatenUserData } from "~/domains/prozesskostenhilfe/formular/persoenlicheDaten/userData";

export const testCasesPKHFormularPersoenlicheDaten = {
  completePersoenlicheDaten: [
    {
      stepId: "/persoenliche-daten/start",
    },
    {
      stepId: "/persoenliche-daten/name",
      userInput: { vorname: "Max", nachname: "Mustermann" },
    },
    {
      stepId: "/persoenliche-daten/geburtsdatum",
      userInput: { geburtsdatum: { day: "01", month: "01", year: "2000" } },
    },
    {
      stepId: "/persoenliche-daten/plz",
      userInput: { plz: "12437" },
    },
    {
      stepId: "/persoenliche-daten/adresse",
      userInput: {
        street: "Musterstraße",
        houseNumber: "1",
        ort: "Musterstadt",
      },
    },
    {
      stepId: "/persoenliche-daten/telefonnummer",
      userInput: { telefonnummer: "" },
    },
    {
      stepId: "/persoenliche-daten/beruf",
      userInput: { beruf: "Softwareentwickler:in" },
    },
    {
      stepId: "/weitere-angaben",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfePersoenlicheDatenUserData>;
