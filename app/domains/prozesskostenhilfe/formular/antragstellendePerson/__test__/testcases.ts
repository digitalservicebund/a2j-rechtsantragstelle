import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { antragTestcaseData } from "./testcaseData";

export const erstAntragCase: FlowTestCases<ProzesskostenhilfeFormularUserData> =
  {
    erstAntragOtherRecipient: [
      {
        stepId: "/antragstellende-person/empfaenger",
        skipPageSchemaValidation: true,
        userInput: {
          ...antragTestcaseData,
          empfaenger: "otherPerson",
        },
      },
      {
        stepId: "/antragstellende-person/zwei-formulare",
        // Explicit validation skip for when we inject nachueberpruefung userInput
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/finanzielle-angaben/einkuenfte/start",
      },
    ],
    erstAntragSelfRecipientNoUnterhaltsanspruch: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
          ...antragTestcaseData,
          empfaenger: "myself",
        },
      },
      {
        stepId: "/antragstellende-person/unterhaltsanspruch",
        userInput: {
          unterhaltsanspruch: "keine",
        },
      },
      {
        stepId: "/rechtsschutzversicherung/rsv-frage",
      },
    ],
    erstAntragSelfRecipientUnterhaltsanspruch: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
          ...antragTestcaseData,
          empfaenger: "myself",
        },
      },
      {
        stepId: "/antragstellende-person/unterhaltsanspruch",
        userInput: {
          unterhaltsanspruch: "unterhalt",
        },
      },
      {
        stepId: "/antragstellende-person/unterhalt",
        userInput: {
          unterhaltsSumme: "1000",
        },
      },
      {
        stepId: "/antragstellende-person/unterhalt-hauptsaechliches-leben",
        userInput: {
          livesPrimarilyFromUnterhalt: "no",
        },
      },
      {
        stepId: "/rechtsschutzversicherung/rsv-frage",
      },
    ],
    erstAntragSelfRecipientLivesFromUnterhalt: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
          ...antragTestcaseData,
          empfaenger: "myself",
        },
      },
      {
        stepId: "/antragstellende-person/unterhaltsanspruch",
        userInput: {
          unterhaltsanspruch: "unterhalt",
        },
      },
      {
        stepId: "/antragstellende-person/unterhalt",
        userInput: {
          unterhaltsSumme: "1000",
        },
      },
      {
        stepId: "/antragstellende-person/unterhalt-hauptsaechliches-leben",
        userInput: {
          livesPrimarilyFromUnterhalt: "yes",
        },
      },
      {
        stepId: "/antragstellende-person/unterhaltspflichtige-person",
        userInput: {
          unterhaltspflichtigePerson: {
            beziehung: "ex-spouse",
            vorname: "Mara",
            nachname: "Mustermann",
          },
        },
      },
      {
        stepId: "/antragstellende-person/eigenes-exemplar",
        // Explicit validation skip for when we inject nachueberpruefung userInput
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/rechtsschutzversicherung/rsv-frage",
      },
    ],
    erstAntragAnspruchNoUnterhalt: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
          ...antragTestcaseData,
          empfaenger: "myself",
        },
      },
      {
        stepId: "/antragstellende-person/unterhaltsanspruch",
        userInput: {
          unterhaltsanspruch: "anspruchNoUnterhalt",
        },
      },
      {
        stepId: "/antragstellende-person/unterhalt-leben-frage",
        userInput: {
          couldLiveFromUnterhalt: "no",
        },
      },
      {
        stepId: "/rechtsschutzversicherung/rsv-frage",
      },
    ],
    erstAntragAnspruchLiveable: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
          ...antragTestcaseData,
          empfaenger: "myself",
        },
      },
      {
        stepId: "/antragstellende-person/unterhaltsanspruch",
        userInput: {
          unterhaltsanspruch: "anspruchNoUnterhalt",
        },
      },
      {
        stepId: "/antragstellende-person/unterhalt-leben-frage",
        userInput: {
          couldLiveFromUnterhalt: "yes",
        },
      },
      {
        stepId: "/antragstellende-person/unterhaltspflichtige-person-beziehung",
        userInput: {
          personWhoCouldPayUnterhaltBeziehung: "ex-spouse",
        },
      },
      {
        stepId: "/antragstellende-person/warum-keiner-unterhalt",
        userInput: {
          whyNoUnterhalt: "Didn't wanna",
        },
      },
      {
        stepId: "/rechtsschutzversicherung/rsv-frage",
      },
    ],
    erstAntragSonstigesUnterhaltsanspruch: [
      {
        stepId: "/antragstellende-person/unterhaltsanspruch",
        userInput: {
          ...antragTestcaseData,
          empfaenger: "myself",
          unterhaltsanspruch: "sonstiges",
        },
      },
      {
        stepId: "/antragstellende-person/unterhaltsbeschreibung",
        userInput: {
          unterhaltsbeschreibung:
            "A very detailed description of the Unterhalt I receive.",
        },
      },
      {
        stepId: "/rechtsschutzversicherung/rsv-frage",
      },
    ],
  };

const nachueberpruefungCase = Object.fromEntries(
  Object.entries(erstAntragCase).map(([testName, testSteps]) => [
    testName.replace("erstAntrag", "nachueberpruefung"),
    testSteps.map(({ stepId, userInput, skipPageSchemaValidation }) => ({
      stepId:
        stepId === "/rechtsschutzversicherung/rsv-frage"
          ? "/finanzielle-angaben/einkuenfte/start"
          : stepId,
      skipPageSchemaValidation: skipPageSchemaValidation,
      userInput: { ...userInput, formularArt: "nachueberpruefung" },
    })),
  ]),
) satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
console.log(JSON.stringify(nachueberpruefungCase, null, 2));

export const testCasesPKHFormularAntragstellendePersonTransitions = {
  ...erstAntragCase,
  ...nachueberpruefungCase,
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
