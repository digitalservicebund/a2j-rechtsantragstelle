import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeAntragstellendePersonUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/userData";

const nextStepRSV = "/rechtsschutzversicherung/rsv-frage";
const nextStepEinkuenfte = "/finanzielle-angaben/einkuenfte/start";

const erstAntragCase: FlowTestCases<ProzesskostenhilfeAntragstellendePersonUserData> =
  {
    erstAntragOtherRecipient: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
          empfaenger: "otherPerson",
        },
      },
      {
        stepId: "/antragstellende-person/zwei-formulare",
        // Explicit validation skip for when we inject nachueberpruefung userInput
        skipPageSchemaValidation: true,
      },
      {
        stepId: nextStepEinkuenfte,
      },
    ],
    erstAntragSelfRecipientNoUnterhaltsanspruch: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
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
        stepId: nextStepRSV,
      },
    ],
    erstAntragSelfRecipientUnterhaltsanspruch: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
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
        stepId: nextStepRSV,
      },
    ],
    erstAntragSelfRecipientLivesFromUnterhalt: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
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
        stepId: nextStepRSV,
      },
    ],
    erstAntragAnspruchNoUnterhalt: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
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
        stepId: nextStepRSV,
      },
    ],
    erstAntragAnspruchLiveable: [
      {
        stepId: "/antragstellende-person/empfaenger",
        userInput: {
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
        stepId: nextStepRSV,
      },
    ],
    erstAntragSonstigesUnterhaltsanspruch: [
      {
        stepId: "/antragstellende-person/unterhaltsanspruch",
        userInput: {
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
        stepId: nextStepRSV,
      },
    ],
  };

const nachueberpruefungCase = Object.fromEntries(
  Object.entries(erstAntragCase).map(([testName, testSteps]) => [
    testName.replace("erstAntrag", "nachueberpruefung"),
    testSteps.map(({ stepId, userInput, skipPageSchemaValidation }) => ({
      stepId: stepId === nextStepRSV ? nextStepEinkuenfte : stepId,
      skipPageSchemaValidation: skipPageSchemaValidation,
      userInput: { ...userInput, formularArt: "nachueberpruefung" },
    })),
  ]),
) satisfies FlowTestCases<ProzesskostenhilfeAntragstellendePersonUserData>;

/**
 * Specifically test the "BACK" transitions pointing to antragstellende-person,
 * as there are two places they can happen: Rechtsschutzversicherung and Finanzielle Angaben
 * (in the case of a Nachueberpruefung)
 */
export const testCasesPKHFormularAntragstellendePersonTransitions = {
  ...erstAntragCase,
  ...nachueberpruefungCase,
} satisfies FlowTestCases<ProzesskostenhilfeAntragstellendePersonUserData>;
