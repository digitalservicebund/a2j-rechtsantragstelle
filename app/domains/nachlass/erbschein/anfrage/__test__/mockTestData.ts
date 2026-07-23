import { type beguenstigtenArray } from "~/domains/nachlass/erbschein/anfrage/testament-oder-erbvertrag/pages";
import type { NachlassErbscheinAnfrageUserData } from "../userData";
import type z from "zod";

export const nachlassErbscheinAnfrageHappyPathData: NachlassErbscheinAnfrageUserData =
  {
    datenverarbeitungZustimmung: "on",
    verstorbenePersonStrasse: "Musterstraße",
    verstorbenePersonHausnummer: "1",
    verstorbenePersonOrt: "Musterstadt",
    antragstellendePersonTelefonnummer: "0123456789",
  };

export const mockBeguenstigtenArray: z.infer<typeof beguenstigtenArray> = [
  {
    vorname: "Marcia",
    nachname: "Mustermann",
    verhaeltnis: "cousin",
    geburtsdatum: {
      day: "01",
      month: "01",
      year: "1990",
    },
    isAlive: "yes",
    strasse: "Musterstraße",
    hausnummer: "1",
    ort: "Musterstadt",
    plz: "12345",
    land: "Deutschland",
  },
];
