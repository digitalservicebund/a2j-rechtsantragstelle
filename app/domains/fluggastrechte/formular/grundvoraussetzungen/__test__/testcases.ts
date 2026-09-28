import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

export const testCasesFluggastrechteFormularGrundvoraussetzungen: FlowTestCases<FluggastrechteUserData> =
  {
    streitbeilegungJa: [
      { stepId: "/intro/start" },
      {
        stepId: "/grundvoraussetzungen/streitbeilegung",
        userInput: {
          streitbeilegung: "yes",
        },
      },
      { stepId: "/grundvoraussetzungen/prozessfaehig" },
      { stepId: "/grundvoraussetzungen/ausgleichszahlung" },
      {
        stepId: "/grundvoraussetzungen/daten-uebernahme",
        userInput: {
          fluggesellschaft: "TAP",
          bereich: "bereich",
          startAirport: "BER",
          endAirport: "FRA",
        },
      },
      {
        stepId: "/grundvoraussetzungen/amtsgericht",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
          },
        },
      },
      { stepId: "/streitwert-kosten/gerichtskosten" },
    ],
    streitbeilegungNoSpecification: [
      { stepId: "/intro/start" },
      {
        stepId: "/grundvoraussetzungen/streitbeilegung",
        userInput: {
          streitbeilegung: "noSpecification",
        },
      },
      { stepId: "/grundvoraussetzungen/prozessfaehig" },
      { stepId: "/grundvoraussetzungen/ausgleichszahlung" },
      {
        stepId: "/grundvoraussetzungen/daten-uebernahme",
        userInput: {
          fluggesellschaft: "TAP",
          bereich: "bereich",
          startAirport: "BER",
          endAirport: "FRA",
        },
      },
      {
        stepId: "/grundvoraussetzungen/amtsgericht",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
          },
        },
      },
      { stepId: "/streitwert-kosten/gerichtskosten" },
    ],
    streitbeilegungNeinGruendeNein: [
      { stepId: "/intro/start" },
      {
        stepId: "/grundvoraussetzungen/streitbeilegung",
        userInput: {
          streitbeilegung: "no",
        },
      },
      {
        stepId: "/grundvoraussetzungen/streitbeilegung-gruende",
        userInput: {
          streitbeilegungGruende: "no",
        },
      },
      { stepId: "/grundvoraussetzungen/prozessfaehig" },
      { stepId: "/grundvoraussetzungen/ausgleichszahlung" },
      {
        stepId: "/grundvoraussetzungen/daten-uebernahme",
        userInput: {
          fluggesellschaft: "TAP",
          bereich: "bereich",
          startAirport: "BER",
          endAirport: "FRA",
        },
      },
      {
        stepId: "/grundvoraussetzungen/amtsgericht",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
          },
        },
      },
      { stepId: "/streitwert-kosten/gerichtskosten" },
    ],
  };
