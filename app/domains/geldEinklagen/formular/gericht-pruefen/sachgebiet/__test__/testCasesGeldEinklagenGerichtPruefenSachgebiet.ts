import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

export const testCasesGeldEinklagenGerichtPruefenSachgebiet = [
  [
    {
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "yes",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/ergebnis/sachgebiet-abbruch",
    ],
  ],
  [
    {
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "anderesRechtsproblem",
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
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "urheberrecht",
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
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "schaden",
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
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "miete",
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
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "miete",
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
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "miete",
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
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "versicherung",
      versicherungVertrag: "yes",
      versicherungsnummer: "yes",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/versicherung-vertrag",
      "/gericht-pruefen/sachgebiet/versicherung-versicherungsnummer",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "versicherung",
      versicherungVertrag: "yes",
      versicherungsnummer: "no",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/versicherung-vertrag",
      "/gericht-pruefen/sachgebiet/versicherung-versicherungsnummer",
      "/gericht-pruefen/klagende-person/fuer-wen",
    ],
  ],
  [
    {
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "versicherung",
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
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "reisen",
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
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "reisen",
      reiseArt: "flug",
    },
    [
      "/gericht-pruefen/sachgebiet/info",
      "/gericht-pruefen/sachgebiet/ausgeschlossen",
      "/gericht-pruefen/sachgebiet/besondere",
      "/gericht-pruefen/sachgebiet/reise-art",
      "/gericht-pruefen/sachgebiet/reise-stopp",
    ],
  ],
  [
    {
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "verkehrsunfall",
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
      forderung: "maximal5000",
      sachgebietAusgeschlossen: "no",
      besondere: "verkehrsunfall",
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
