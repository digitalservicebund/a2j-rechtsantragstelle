import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext = {
  forderung: "maximal5000" as const,
  sachgebietAusgeschlossen: "yes" as const,
  fuerWenKlagen: "selbst" as const,
  besondere: "versicherung" as const,
};

export const testCasesGeldEinklagenVersicherung = [
  [
    {
      ...baseContext,
      klagendeVerbraucher: "no",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeVerbraucher: "yes",
      versicherungVertrag: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeVerbraucher: "yes",
      versicherungVertrag: "yes",
      versicherungsnummer: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeVerbraucher: "yes",
      versicherungVertrag: "yes",
      versicherungsnummer: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/haustuergeschaeft",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
