import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import { fluggastrechteGuards } from "~/domains/fluggastrechte/formular/guards";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FlowStateMachine } from "~/services/flow/server/types";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const happyPathSteps = [
  "/intro/start",
  "/grundvoraussetzungen/datenverarbeitung",
  "/grundvoraussetzungen/streitbeilegung",
  "/grundvoraussetzungen/prozessfaehig",
  "/grundvoraussetzungen/ausgleichszahlung",
  "/grundvoraussetzungen/daten-uebernahme",
  "/grundvoraussetzungen/amtsgericht",
  "/streitwert-kosten/gerichtskosten",
];

const cases = [
  [
    {
      datenverarbeitungZustimmung: "on",
      fluggesellschaft: "TAP",
      bereich: "bereich",
      startAirport: "BER",
      endAirport: "FRA",
      streitbeilegung: "yes",
    },
    happyPathSteps,
  ],
  [
    {
      datenverarbeitungZustimmung: "on",
      fluggesellschaft: "TAP",
      bereich: "bereich",
      startAirport: "BER",
      endAirport: "FRA",
      streitbeilegung: "noSpecification",
    },
    happyPathSteps,
  ],
  [
    {
      datenverarbeitungZustimmung: "on",
      fluggesellschaft: "TAP",
      bereich: "bereich",
      startAirport: "BER",
      endAirport: "FRA",
      streitbeilegung: "no",
      streitbeilegungGruende: "no",
    },
    [
      "/intro/start",
      "/grundvoraussetzungen/datenverarbeitung",
      "/grundvoraussetzungen/streitbeilegung",
      "/grundvoraussetzungen/streitbeilegung-gruende",
      "/grundvoraussetzungen/prozessfaehig",
      "/grundvoraussetzungen/ausgleichszahlung",
      "/grundvoraussetzungen/daten-uebernahme",
      "/grundvoraussetzungen/amtsgericht",
      "/streitwert-kosten/gerichtskosten",
    ],
  ],
] as const satisfies TestCases<FluggastrechteUserData>;

export const testCasesFluggastrechteFormularGrundvoraussetzungen = {
  machine,
  cases,
};
