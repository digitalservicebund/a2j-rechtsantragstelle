import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../userData";

const ZIP_CODE_PILOT_COURT = "10823";

const baseContext: GeldEinklagenFormularUserData = {
  forderung: "maximal5000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
  gegenWenBeklagen: "person",
  mietePachtVertrag: "yes",
  mietePachtRaum: "yes",
  postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
};

export const testCasesStreitwertKosten = [
  [
    {
      ...baseContext,
    },
    [
      "/klage-erstellen/intro/start",
      "/klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
      "/klage-erstellen/streitwert-kosten/weitere-kosten",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
