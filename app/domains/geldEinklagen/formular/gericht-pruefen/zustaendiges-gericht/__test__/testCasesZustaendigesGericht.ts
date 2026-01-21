import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "10823";
const ZIP_CODE_NON_PILOT_COURT = "10115";
const ZIP_CODE_EDGE_CASE_SECONDARY = "53111";

const baseContext: GeldEinklagenFormularUserData = {
  forderung: "maximal10000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
  gegenWenBeklagen: "person",
};

export const testCasesZustaendigesGericht = [
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
      postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      "/klage-erstellen/intro/start",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      "/klage-erstellen/intro/start",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
      postleitzahlSecondary: ZIP_CODE_NON_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
      "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_NON_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "yes",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
      pilotGerichtAuswahl: "sekundaerCourt",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      "/klage-erstellen/intro/start",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "yes",
      postleitzahlBeklagtePerson: ZIP_CODE_NON_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_NON_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
      "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "yes",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_NON_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      "/klage-erstellen/intro/start",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "yes",
      postleitzahlBeklagtePerson: ZIP_CODE_NON_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
      "/klage-erstellen/intro/start",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
