import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

export const testCasesFluggastrechteFormularStreitwertKosten = [
  [
    {
      prozesszinsen: "yes",
      fluggesellschaft: "SU",
    },
    [
      "/streitwert-kosten/gerichtskosten",
      "/streitwert-kosten/andere-kosten",
      "/streitwert-kosten/prozesszinsen",
      "/flugdaten/adresse-fluggesellschaft",
    ],
  ],
  [
    {
      prozesszinsen: "yes",
      fluggesellschaft: "LH",
    },
    [
      "/streitwert-kosten/gerichtskosten",
      "/streitwert-kosten/andere-kosten",
      "/streitwert-kosten/prozesszinsen",
      "/flugdaten/adresse-fluggesellschaft-auswahl",
    ],
  ],
] as const satisfies TestCases<FluggastrechteUserData>;
