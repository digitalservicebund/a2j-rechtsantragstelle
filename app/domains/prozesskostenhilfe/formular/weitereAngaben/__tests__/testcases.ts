import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { pkhTestcaseData } from "../../__test__/testcasesData";

// Abgabe is only reachable once every other section is done
const allSectionsDone = {
  subflowDoneStates: {
    "/start": true,
    "/grundvoraussetzungen": true,
    "/antragstellende-person": true,
    "/rechtsschutzversicherung": true,
    "/finanzielle-angaben": true,
    "/gesetzliche-vertretung": true,
    "/persoenliche-daten": true,
    "/weitere-angaben": true,
  },
};

export const testCasesPKHFormularWeitereAngaben = {
  weitereAngabenSectionsMissing: [
    {
      stepId: "/persoenliche-daten/beruf",
      userInput: {
        ...pkhTestcaseData,
        beruf: "Softwareentwickler:in",
      },
    },
    {
      stepId: "/weitere-angaben",
      userInput: {
        weitereAngaben: "",
      },
    },
    {
      stepId: "/abgabe/ueberpruefung",
    },
  ],
  weitereAngabenAllSectionsDone: [
    {
      stepId: "/persoenliche-daten/beruf",
      userInput: {
        ...pkhTestcaseData,
        beruf: "Softwareentwickler:in",
      },
    },
    {
      stepId: "/weitere-angaben",
      userInput: {
        weitereAngaben: "",
      },
      pageData: allSectionsDone,
    },
    {
      stepId: "/abgabe/zusammenfassung",
    },
    {
      stepId: "/abgabe/ende",
    },
  ],
  // Nachueberpruefung skips rechtsschutzversicherung, so it is never done
  weitereAngabenNachueberpruefungAllSectionsDone: [
    {
      stepId: "/persoenliche-daten/beruf",
      userInput: {
        ...pkhTestcaseData,
        formularArt: "nachueberpruefung",
        beruf: "Softwareentwickler:in",
      },
    },
    {
      stepId: "/weitere-angaben",
      userInput: {
        weitereAngaben: "",
      },
      pageData: {
        subflowDoneStates: {
          ...allSectionsDone.subflowDoneStates,
          "/rechtsschutzversicherung": false,
        },
      },
    },
    {
      stepId: "/abgabe/zusammenfassung",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
