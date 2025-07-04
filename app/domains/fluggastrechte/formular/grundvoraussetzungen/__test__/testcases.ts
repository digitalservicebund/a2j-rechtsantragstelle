import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

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

export const testCasesFluggastrechteFormularGrundvoraussetzungen = [
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
