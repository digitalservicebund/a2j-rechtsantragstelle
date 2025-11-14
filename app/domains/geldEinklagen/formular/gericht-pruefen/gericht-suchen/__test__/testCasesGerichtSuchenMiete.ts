import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  forderung: "maximal5000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
  gegenWenBeklagen: "person",
  postleitzahlBeklagtePerson: "000800",
  postleitzahlSecondary: "000800",
};

export const testCasesGerichtSuchenMiete = [
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "yes",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "yes",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "no",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "no",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "no",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "no",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "no",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "no",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
