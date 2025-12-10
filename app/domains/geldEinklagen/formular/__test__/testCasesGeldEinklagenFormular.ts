import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { geldEinklagenFormular } from "..";
import { testCasesForderung } from "../gericht-pruefen/__test__/testCasesForderung";
import { testCasesSachgebiet } from "../gericht-pruefen/sachgebiet/__test__/testCasesSachgebiet";
import { testCasesBeklagtePersonUrheberrecht } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonUrheberrecht";
import { testCasesBeklagtePersonMiete } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonMiete";
import { testCasesBeklagteOtherSachgebiet } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonOtherSachgebiet";
import { testCasesKlagendePersonVerkehrsunfallSchadenVersicherung } from "../gericht-pruefen/klagendePerson/__test__/testCasesKlagendePersonVerkehrsunfallSchadenVersicherung";
import { testCasesKlagendePersonReisenAnderesRechtsproblemUrheberrecht } from "../gericht-pruefen/klagendePerson/__test__/testCasesKlagendePersonReisenAnderesRechtsproblemUrheberrecht";
import { testCasesKlagendePersonMiete } from "../gericht-pruefen/klagendePerson/__test__/testCasesKlagendePersonMiete";
import { testCasesGerichtSuchenMiete } from "../gericht-pruefen/gericht-suchen/__test__/testCasesGerichtSuchenMiete";
import { testCasesGerichtSuchenVersicherung } from "../gericht-pruefen/gericht-suchen/__test__/testCasesGerichtSuchenVersicherung";
import { testCasesGerichtSuchenReisenAnderesRechtsproblem } from "../gericht-pruefen/gericht-suchen/__test__/testCasesGerichtSuchenReisenAnderesRechtsproblem";
import { testCasesGerichtSuchenVerkehrsunfall } from "../gericht-pruefen/gericht-suchen/__test__/testCasesGerichtSuchenVerkehrsunfall";
import { testCasesGerichtSuchenSchaden } from "../gericht-pruefen/gericht-suchen/__test__/testCasesGerichtSuchenSchaden";
import { testCasesGerichtSuchenUrheberrecht } from "../gericht-pruefen/gericht-suchen/__test__/testCasesGerichtSuchenUrheberrecht";
import { testCasesGerichtSuchenEdgeCasesZipCode } from "../gericht-pruefen/gericht-suchen/__test__/testCasesGerichtSuchenEdgeCasesZipCode";
import { testCasesZustaendigesGericht } from "../gericht-pruefen/zustaendiges-gericht/__test__/testCasesZustaendigesGericht";
import { testCasesBeklagteSchadenVersicherung } from "../gericht-pruefen/beklagtePerson/__test__/testCasesBeklagtePersonSchadenVersicherung";
import { testCasesStreitwertKosten } from "../klage-erstellen/__test__/testCasesStreitwertKosten";

const machine: FlowStateMachine = createMachine(
  { ...geldEinklagenFormular.config, context: {} },
  { guards: {} },
);

const testsCases = [
  ...testCasesForderung,
  ...testCasesSachgebiet,
  ...testCasesKlagendePersonVerkehrsunfallSchadenVersicherung,
  ...testCasesKlagendePersonReisenAnderesRechtsproblemUrheberrecht,
  ...testCasesKlagendePersonMiete,
  ...testCasesBeklagtePersonUrheberrecht,
  ...testCasesBeklagtePersonMiete,
  ...testCasesBeklagteOtherSachgebiet,
  ...testCasesBeklagteSchadenVersicherung,
  ...testCasesGerichtSuchenMiete,
  ...testCasesGerichtSuchenVersicherung,
  ...testCasesGerichtSuchenReisenAnderesRechtsproblem,
  ...testCasesGerichtSuchenVerkehrsunfall,
  ...testCasesGerichtSuchenSchaden,
  ...testCasesGerichtSuchenUrheberrecht,
  ...testCasesGerichtSuchenEdgeCasesZipCode,
  ...testCasesZustaendigesGericht,
  ...testCasesStreitwertKosten,
];

export const testCasesGeldEinklagenFormular = {
  machine,
  cases: testsCases,
};
