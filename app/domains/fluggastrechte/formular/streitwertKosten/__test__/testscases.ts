import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

export const testCasesFluggastrechteFormularStreitwertKosten = [
  [
    {
      prozesszinsen: "yes",
    },
    [
      "/streitwert-kosten/gerichtskosten",
      "/streitwert-kosten/andere-kosten",
      "/streitwert-kosten/prozesszinsen",
      "/flugdaten/adresse-fluggesellschaft",
    ],
  ],
] as const satisfies TestCases<FluggastrechteUserData>;
