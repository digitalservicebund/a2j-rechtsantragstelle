import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "no",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/sachgebiet": true,
    },
  },
};

export const testCasesSachgebiet = [
  [
    {
      ...baseContext,
      ausgeschlossen: "yes",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/ergebnis/sachgebiet-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "anderesRechtsproblem",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "urheberrecht",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "schaden",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "miete",
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/miete-pacht-vertrag",
      "/gericht-pruefen/sachgebiet/miete-pacht-raum",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "miete",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/miete-pacht-vertrag",
      "/gericht-pruefen/sachgebiet/miete-pacht-raum",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "miete",
      mietePachtVertrag: "no",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/miete-pacht-vertrag",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "versicherung",
      versicherungVertrag: "yes",
      versicherungsnehmer: "yes",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/versicherung-vertrag",
      "/gericht-pruefen/sachgebiet/versicherung-versicherungsnehmer",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "versicherung",
      versicherungVertrag: "yes",
      versicherungsnehmer: "no",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/versicherung-vertrag",
      "/gericht-pruefen/sachgebiet/versicherung-versicherungsnehmer",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "versicherung",
      versicherungVertrag: "no",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/versicherung-vertrag",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "reisen",
      reiseArt: "andereReise",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/reise-art",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "reisen",
      reiseArt: "flug",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/reise-art",
      "/gericht-pruefen/sachgebiet/ergebnis/reise-flug",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "verkehrsunfall",
      verkehrsunfallStrassenverkehr: "yes",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/verkehrsunfall-strassenverkehr",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "verkehrsunfall",
      verkehrsunfallStrassenverkehr: "no",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/verkehrsunfall-strassenverkehr",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
